"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    collection,
    query,
    orderBy,
    limit,
    getDocs,
    addDoc,
    serverTimestamp,
    where
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Timer, ArrowLeft, Loader2, CheckCircle2, XCircle, Scroll, Home, Sparkles, Crown } from "lucide-react";
import AdBanner from "@/components/AdBanner";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { QUIZ_CATEGORIES } from "../lib/constants";
import FantasyCountdown from "../components/FantasyCountdown";
import ScoreCard from "../components/ScoreCard";

type GameState = "lobby" | "playing" | "result";

interface Question {
    id: string;
    text: string;
    options: string[];
    correctIndex: number;
}

interface Ranking {
    id: string;
    nickname: string;
    score: number;
    totalTime: number;
    category?: string;
}

function SoloGameContent() {
    // Removed useSearchParams for category. Default is now managed by local state.
    const [category, setCategory] = useState<string>("party");

    const [gameState, setGameState] = useState<GameState>("lobby");
    const [nickname, setNickname] = useState("");
    const [rankings, setRankings] = useState<Ranking[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [totalTime, setTotalTime] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10);
    const [answered, setAnswered] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Countdown state (boolean flag)
    const [showCountdown, setShowCountdown] = useState(false);

    const { user, loginAnonymously } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number>(0);

    const selectedCategoryData = QUIZ_CATEGORIES.find(c => c.id === category) || QUIZ_CATEGORIES[0];

    // Fetch Rankings for Lobby - depends on selected category
    useEffect(() => {
        if (gameState === "lobby") {
            setRankings([]); // Clear previous rankings immediately

            const fetchRankings = async () => {
                try {
                    let q;
                    // First try optimized query with index
                    if (category === "all") {
                        q = query(
                            collection(db, "leaderboard"),
                            orderBy("score", "desc"),
                            orderBy("totalTime", "asc"),
                            limit(10)
                        );
                    } else {
                        q = query(
                            collection(db, "leaderboard"),
                            where("category", "==", category),
                            orderBy("score", "desc"),
                            orderBy("totalTime", "asc"),
                            limit(10)
                        );
                    }

                    const snap = await getDocs(q);
                    const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ranking));
                    setRankings(list);
                } catch (error: any) {
                    console.warn("Primary ranking query failed (missing index?), trying fallback:", error.message);

                    // Fallback: Fetch without complex sort and sort clientside
                    // This creates a simpler query that usually works without composite indexes
                    try {
                        let qFallback;
                        if (category === "all") {
                            qFallback = query(
                                collection(db, "leaderboard"),
                                orderBy("score", "desc"),
                                limit(50) // Fetch more to sort clientside
                            );
                        } else {
                            qFallback = query(
                                collection(db, "leaderboard"),
                                where("category", "==", category),
                                limit(50)
                            );
                        }

                        const snap = await getDocs(qFallback);
                        let list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ranking));

                        // Manual Sort: Score desc, then Time asc
                        list.sort((a, b) => {
                            if (b.score !== a.score) return b.score - a.score;
                            return a.totalTime - b.totalTime;
                        });

                        setRankings(list.slice(0, 10));
                    } catch (fallbackError: any) {
                        console.error("Ranking fetch fallback failed:", fallbackError);
                        // Ensure list is empty on error
                        setRankings([]);
                    }
                }
            };
            fetchRankings();
        }
    }, [gameState, category]); // Added category to dependency array to refresh ranking on change

    // Countdown Effect removed - managed by FantasyCountdown component internal state

    // Handle Game Start
    const startGame = async () => {
        if (!nickname.trim()) {
            toast({ title: "名前を入力してください", variant: "destructive" });
            return;
        }

        setIsLoading(true);
        try {
            if (!user) await loginAnonymously();

            let qQuestions;
            if (category === "all") {
                qQuestions = query(collection(db, "questions"));
            } else {
                qQuestions = query(collection(db, "questions"), where("category", "==", category));
            }

            const snap = await getDocs(qQuestions);
            const allQuestions = snap.docs
                .map(doc => {
                    const data = doc.data();
                    const rawOptions = data.options || data.choices || [];
                    const rawCorrectIndex = data.correctIndex ?? data.correctAnswer ?? 0;

                    // Create shuffleable objects
                    const choiceObjects = rawOptions.map((text: string, i: number) => ({
                        text,
                        isCorrect: i === rawCorrectIndex
                    }));

                    // Fisher-Yates Shuffle
                    for (let i = choiceObjects.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [choiceObjects[i], choiceObjects[j]] = [choiceObjects[j], choiceObjects[i]];
                    }

                    return {
                        id: doc.id,
                        text: data.text || "問題文なし",
                        options: choiceObjects.map((c: any) => c.text),
                        correctIndex: choiceObjects.findIndex((c: any) => c.isCorrect)
                    } as Question;
                })
                .filter(q => q.options.length >= 2 && q.text);

            if (allQuestions.length === 0) {
                // Determine error message based on category
                throw new Error(category === "all"
                    ? "問題が見つかりませんでした。"
                    : `テーマ「${category}」の問題はまだありません。`);
            }

            const shuffled = allQuestions.sort(() => 0.5 - Math.random()).slice(0, 10);

            setQuestions(shuffled);

            // Start countdown flag
            setShowCountdown(true);

            // Background setup
            setGameState("playing");
            setCurrentQuestionIndex(0);
            setScore(0);
            setTotalTime(0);
            // nextQuestion will be called via onComplete callback
        } catch (error: any) {
            toast({ title: "エラー", description: error.message, variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const nextQuestion = (index: number, qList?: Question[]) => {
        const list = qList || questions;
        if (index >= list.length) {
            endGame();
            return;
        }

        setCurrentQuestionIndex(index);
        setTimeLeft(10);
        setAnswered(false);
        setSelectedOption(null);
        startTimeRef.current = Date.now();

        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    handleAnswer(-1); // Timeout
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleAnswer = (optionIndex: number) => {
        if (answered) return;
        if (timerRef.current) clearInterval(timerRef.current);

        const endTime = Date.now();
        const timeSpent = (endTime - startTimeRef.current) / 1000;
        const currentQ = questions[currentQuestionIndex];
        const isCorrect = optionIndex === currentQ.correctIndex;

        setAnswered(true);
        setSelectedOption(optionIndex);
        setTotalTime(prev => prev + timeSpent);

        if (isCorrect) {
            const speedBonus = Math.max(0, 1 - (timeSpent / 10)) * 500;
            const points = Math.round(1000 + speedBonus);
            setScore(prev => prev + points);
        }

        setTimeout(() => {
            nextQuestion(currentQuestionIndex + 1);
        }, 1200);
    };

    const endGame = async () => {
        if (timerRef.current) clearInterval(timerRef.current);

        setIsLoading(true);
        try {
            await addDoc(collection(db, "leaderboard"), {
                nickname,
                score,
                totalTime,
                category,
                timestamp: serverTimestamp(),
                userId: user?.uid || "anonymous"
            });
        } catch (error: any) {
            console.error("Error saving score:", error);
            toast({ title: "スコアの保存に失敗しました", description: error.message, variant: "destructive" });
        } finally {
            setIsLoading(false);
            setGameState("result");
        }
    };

    return (
        <AnimatePresence mode="wait">
            {showCountdown && (
                <FantasyCountdown
                    seconds={3}
                    onComplete={() => {
                        setShowCountdown(false);
                        nextQuestion(0, questions);
                    }}
                />
            )}

            {gameState === "lobby" && (
                <motion.div
                    key="lobby"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="w-full max-w-4xl z-10 space-y-12"
                >
                    <div className="text-center space-y-2">
                        <h1 className="text-4xl font-black gold-text tracking-widest uppercase">
                            Score Attack
                        </h1>
                        <p className="text-amber-200/50 font-bold tracking-widest uppercase text-xs">
                            スコアアタックモード / <span className="text-amber-500">{category.toUpperCase()}</span>
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        <Card className="fantasy-card border-none bg-black/60 p-6 space-y-6">

                            {/* Category Selector */}
                            <div className="space-y-3 pb-2 border-b border-white/10">
                                <label className="text-amber-500/70 font-bold text-xs uppercase tracking-widest ml-1">テーマを選択</label>
                                <div className="grid grid-cols-5 gap-2">
                                    {QUIZ_CATEGORIES.map((cat) => {
                                        const Icon = cat.icon;
                                        const isSelected = category === cat.id;
                                        return (
                                            <button
                                                key={cat.id}
                                                onClick={() => setCategory(cat.id)}
                                                className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${isSelected
                                                    ? "bg-amber-900/40 border border-amber-500 scale-105 shadow-[0_0_10px_rgba(251,191,36,0.2)]"
                                                    : "bg-black/20 border border-transparent hover:bg-white/5 opacity-60 hover:opacity-100"
                                                    }`}
                                            >
                                                <Icon className={`h-5 w-5 mb-1 ${isSelected ? cat.color : "text-white"}`} />
                                                <span className={`text-[8px] font-bold whitespace-nowrap ${isSelected ? "text-amber-100" : "text-white/50"}`}>
                                                    {cat.name}
                                                </span>
                                            </button>
                                        )
                                    })}
                                </div>
                                <div className="text-center p-2 bg-black/20 rounded-lg border border-white/5">
                                    <p className={`text-xs font-bold ${selectedCategoryData.color}`}>
                                        {selectedCategoryData.name}
                                    </p>
                                    <p className="text-[10px] text-amber-100/50 mt-1">
                                        {selectedCategoryData.description}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-amber-500/70 font-bold text-xs uppercase tracking-widest ml-1">ニックネームを入力</label>
                                <Input
                                    placeholder="ニックネーム..."
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    className="h-14 bg-black/40 border-amber-900/50 text-white text-xl focus:border-amber-500"
                                />
                            </div>
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-amber-900/10 border border-amber-900/30">
                                    <h4 className="text-amber-400 font-bold mb-2 text-sm flex items-center gap-2">
                                        <Timer className="h-4 w-4" /> ルール
                                    </h4>
                                    <ul className="text-xs text-amber-200/60 space-y-1 leading-relaxed">
                                        <li>• <span className="font-bold text-amber-500">{category === "all" ? "全ジャンル" : selectedCategoryData.name}</span> の問題が出題されます。</li>
                                        <li>• 全10問。回答時間は各10秒。</li>
                                        <li>• 早く答えるほどスピードボーナス獲得！</li>
                                        <li>• ニックネームとスコアは全国ランキングに表示されます。</li>
                                    </ul>
                                </div>
                                <Button
                                    onClick={startGame}
                                    disabled={!nickname || (isLoading && gameState === "lobby")}
                                    className="w-full h-20 text-xl font-black fantasy-button group text-amber-100"
                                >
                                    {isLoading && gameState === "lobby" ? <Loader2 className="animate-spin" /> : "ゲームを開始する"}
                                </Button>
                            </div>
                        </Card>

                        <Card className="fantasy-card border-none bg-black/60 p-6">
                            <CardHeader className="p-0 pb-4">
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <Trophy className="h-5 w-5 text-amber-500" />
                                    <span className="gold-text italic uppercase">Rankings</span>
                                    {/* Ranking Category Indicator */}
                                    <span className="ml-auto text-xs py-1 px-2 rounded bg-amber-950/50 border border-amber-500/30 text-amber-200/70">
                                        {selectedCategoryData.name}
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                                {rankings.length > 0 ? (
                                    rankings.map((r, idx) => (
                                        <div key={r.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                            <div className="flex items-center gap-3">
                                                <span className={`w-6 h-6 rounded flex items-center justify-center font-black text-xs ${idx === 0 ? "bg-amber-500 text-black" :
                                                    idx === 1 ? "bg-slate-300 text-black" :
                                                        idx === 2 ? "bg-amber-800 text-white" : "text-white/40"
                                                    }`}>{idx + 1}</span>
                                                <span className="font-bold text-sm truncate max-w-[100px]">{r.nickname}</span>
                                            </div>
                                            <span className="font-mono text-amber-500 font-black text-sm">{r.score}pt</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-20 text-center text-white/20 italic">
                                        戦績データがありません<br />
                                        <span className="text-xs text-white/10">新しいテーマに挑戦しよう！</span>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Info Sections Merged from Main Page */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="fantasy-card bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-white/5 space-y-4"
                        >
                            <h2 className="text-2xl font-black gold-text italic flex items-center gap-3">
                                <Crown className="h-6 w-6 text-amber-500" />
                                スコアアタックモードの遊び方
                            </h2>
                            <ul className="space-y-4 text-amber-100/80 font-medium leading-relaxed">
                                <li className="flex gap-3"><span className="text-amber-500 font-bold">01.</span><span>テーマを選択し、ニックネームを入力。</span></li>
                                <li className="flex gap-3"><span className="text-amber-500 font-bold">02.</span><span>厳選された問題が全10問出題。</span></li>
                                <li className="flex gap-3"><span className="text-amber-500 font-bold">03.</span><span>各問題の制限時間は10秒。</span></li>
                                <li className="flex gap-3"><span className="text-amber-500 font-bold">04.</span><span>ジャンル別ランキングで頂点を目指せ。</span></li>
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="fantasy-card bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-white/5 space-y-4"
                        >
                            <h2 className="text-2xl font-black gold-text italic flex items-center gap-3">
                                <Scroll className="h-6 w-6 text-amber-500" />
                                栄光への挑戦
                            </h2>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-amber-400 font-bold mb-1">登録不要で即挑戦</h3>
                                    <p className="text-amber-100/60 text-sm">面倒な登録は一切不要。今すぐ開始できます。</p>
                                </div>
                                <div>
                                    <h3 className="text-amber-400 font-bold mb-1">全国ランキングに挑戦</h3>
                                    <p className="text-amber-100/60 text-sm">全国のプレイヤーと競い、頂点を目指しましょう。</p>
                                </div>
                            </div>
                        </motion.div>
                    </section>

                    <AdBanner adSlot="solo_lobby_bottom" />

                    <div className="flex justify-center pb-8">
                        <Button variant="ghost" onClick={() => router.push("/FantasyQuizzesKingdom")} className="text-white/30 hover:text-amber-500">
                            <Home className="mr-2 h-4 w-4" /> ホームに戻る
                        </Button>
                    </div>
                </motion.div>
            )}

            {gameState === "playing" && (
                <motion.div
                    key="playing"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    className="w-full max-w-3xl z-10 flex flex-col items-center gap-8"
                >
                    <div className="w-full flex justify-between items-end px-4">
                        <div className="space-y-1">
                            <Badge variant="outline" className="border-amber-500 text-amber-500 px-4 py-1">
                                第 {currentQuestionIndex + 1} 問 / 10
                            </Badge>
                            <div className="text-3xl font-black italic gold-text">SCORE: {score}</div>
                        </div>

                        <div className="relative w-20 h-20 flex items-center justify-center">
                            <svg className="absolute inset-0 w-full h-full -rotate-90">
                                <circle cx="40" cy="40" r="36" stroke="rgba(251,191,36,0.1)" strokeWidth="4" fill="none" />
                                <motion.circle
                                    cx="40" cy="40" r="36"
                                    stroke="#f59e0b"
                                    strokeWidth="4"
                                    fill="none"
                                    strokeDasharray="226"
                                    animate={{ strokeDashoffset: 226 - (226 * timeLeft) / 10 }}
                                    transition={{ duration: 1, ease: "linear" }}
                                />
                            </svg>
                            <div className={`text-3xl font-black font-mono transition-colors ${timeLeft < 3 ? "text-red-500 animate-pulse" : "text-amber-500"}`}>
                                {timeLeft}
                            </div>
                        </div>
                    </div>

                    <Card className="fantasy-card w-full border-none bg-black/60 p-10 md:p-16 relative overflow-hidden">
                        <div className="absolute top-0 right-10 p-2 opacity-5">
                            <Sparkles className="h-40 w-40 text-amber-500" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-white leading-relaxed relative z-10">
                            {questions[currentQuestionIndex]?.text}
                        </h2>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        {questions[currentQuestionIndex]?.options.map((option, idx) => {
                            const isCorrect = idx === questions[currentQuestionIndex].correctIndex;
                            const isSelected = idx === selectedOption;
                            let btnStyle = "bg-white/5 border-white/10 hover:border-amber-500/50 hover:bg-white/10";
                            if (answered) {
                                if (isCorrect) btnStyle = "bg-green-500/20 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]";
                                else if (isSelected) btnStyle = "bg-red-500/20 border-red-500 opacity-50";
                                else btnStyle = "bg-white/5 border-white/5 opacity-30";
                            }
                            return (
                                <motion.button
                                    key={idx}
                                    whileHover={!answered ? { y: -2 } : {}}
                                    whileTap={!answered ? { scale: 0.98 } : {}}
                                    onClick={() => handleAnswer(idx)}
                                    disabled={answered}
                                    className={`p-6 rounded-2xl border-2 text-left transition-all relative overflow-hidden group ${btnStyle}`}
                                >
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 text-4xl font-black italic group-hover:text-amber-500/10 transition-colors">
                                        {idx + 1}
                                    </span>
                                    <span className="relative z-10 font-bold pl-8 block text-lg">{option}</span>
                                    {answered && isCorrect && <CheckCircle2 className="absolute right-6 top-1/2 -translate-y-1/2 h-6 w-6 text-green-500" />}
                                    {answered && isSelected && !isCorrect && <XCircle className="absolute right-6 top-1/2 -translate-y-1/2 h-6 w-6 text-red-500" />}
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.div>
            )}

            {gameState === "result" && (
                <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-xl z-10 text-center space-y-8"
                >
                    <div className="space-y-4">
                        <motion.div
                            initial={{ rotate: -10, scale: 0.8 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                        >
                            <Trophy className="h-24 w-24 text-amber-500 mx-auto drop-shadow-[0_0_30px_rgba(251,191,36,0.5)]" />
                        </motion.div>
                        <h2 className="text-4xl font-black gold-text tracking-widest uppercase">スコア確定</h2>
                    </div>

                    <ScoreCard
                        playerName={nickname || "Guest"}
                        genre={category === "all" ? "ALL" : QUIZ_CATEGORIES.find(c => c.id === category)?.name.toUpperCase() || "UNKNOWN"}
                        score={score}
                        rank={
                            score >= 14000 ? "Legend" :
                                score >= 12000 ? "Grand Master" :
                                    score >= 10000 ? "Master" :
                                        score >= 8000 ? "Expert" :
                                            score >= 5000 ? "Adventurer" : "Novice"
                        }
                    />

                    <div className="flex flex-col gap-3">
                        <Button
                            onClick={() => {
                                const rankTitle =
                                    score >= 14000 ? "Legend" :
                                        score >= 10000 ? "Master" :
                                            score >= 8000 ? "Expert" :
                                                score >= 5000 ? "Adventurer" : "Novice";
                                const genreName = category === "all" ? "ALL" : QUIZ_CATEGORIES.find(c => c.id === category)?.name.toUpperCase() || "UNKNOWN";

                                // OGP Share URL
                                const shareUrl = new URL(`${window.location.origin}/share/result`);
                                shareUrl.searchParams.set('name', nickname || 'Guest');
                                shareUrl.searchParams.set('score', score.toString());
                                shareUrl.searchParams.set('rank', rankTitle);
                                shareUrl.searchParams.set('genre', genreName);
                                shareUrl.searchParams.set('rankLabel', 'RANK');

                                const text = `【TRIAL RECORD】\n#FantasyQuizzesKingdom #SparksStation #クイズ`;
                                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl.toString())}`, '_blank');
                            }}
                            className="w-full h-14 bg-black text-white hover:bg-black/80 font-bold rounded-xl border border-white/10 flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                            結果をXでポスト
                        </Button>
                        <Button
                            onClick={() => setGameState("lobby")}
                            className="w-full h-14 text-lg font-black fantasy-button text-amber-100"
                        >
                            もう一度挑戦する
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => router.push("/FantasyQuizzesKingdom")}
                            className="text-white/30 hover:text-amber-500"
                        >
                            ホームに戻る
                        </Button>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-white/20 font-black tracking-[0.4em] text-[10px] uppercase">
                        Glory awaits the swift
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default function SoloPage() {
    return (
        <main className="min-h-screen relative bg-slate-950 text-white p-4 py-20 flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[url('/fantasy-bg.png')] bg-cover bg-center mix-blend-overlay opacity-20 pointer-events-none" />

            <Suspense fallback={
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
                    <p className="text-amber-200/50 text-sm tracking-widest animate-pulse">LOADING...</p>
                </div>
            }>
                <SoloGameContent />
            </Suspense>
        </main>
    );
}
