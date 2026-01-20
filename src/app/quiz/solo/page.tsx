"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    collection,
    query,
    orderBy,
    limit,
    getDocs,
    addDoc,
    serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Timer, ArrowLeft, Loader2, CheckCircle2, XCircle, Scroll, Home, Sparkles, Sword, Crown } from "lucide-react";
import AdBanner from "@/components/AdBanner";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

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
}

export default function SoloPage() {
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

    const { user, loginAnonymously } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number>(0);

    // Fetch Rankings for Lobby
    useEffect(() => {
        if (gameState === "lobby") {
            const fetchRankings = async () => {
                try {
                    // Try preferred query with two orders (Requires Composite Index)
                    const qPrimary = query(
                        collection(db, "leaderboard"),
                        orderBy("score", "desc"),
                        orderBy("totalTime", "asc"),
                        limit(10)
                    );
                    const snap = await getDocs(qPrimary);
                    const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ranking));
                    setRankings(list);
                } catch (error: any) {
                    console.error("Primary ranking fetch failed, trying fallback:", error);

                    // Fallback to single order if the index doesn't exist yet
                    try {
                        const qFallback = query(
                            collection(db, "leaderboard"),
                            orderBy("score", "desc"),
                            limit(10)
                        );
                        const snap = await getDocs(qFallback);
                        const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ranking));
                        setRankings(list);

                        // Notify that ranking is simplified
                        if (error.message?.includes("index")) {
                            console.warn("Composite index missing. Using simpler ranking.");
                        }
                    } catch (fallbackError: any) {
                        toast({
                            title: "ランキングの取得に失敗しました",
                            description: fallbackError.message || "通信エラーが発生しました。",
                            variant: "destructive"
                        });
                    }
                }
            };
            fetchRankings();
        }
    }, [gameState, toast]);

    // Handle Game Start
    const startGame = async () => {
        if (!nickname.trim()) {
            toast({ title: "名前を入力してください", variant: "destructive" });
            return;
        }

        setIsLoading(true);
        try {
            if (!user) await loginAnonymously();

            const snap = await getDocs(collection(db, "questions"));
            const allQuestions = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Question));
            const shuffled = allQuestions.sort(() => 0.5 - Math.random()).slice(0, 10);

            if (shuffled.length < 1) {
                throw new Error("問題が見つかりませんでした。");
            }

            setQuestions(shuffled);
            setGameState("playing");
            setCurrentQuestionIndex(0);
            setScore(0);
            setTotalTime(0);
            nextQuestion(0, shuffled);
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
        // Attempt to save result
        try {
            await addDoc(collection(db, "leaderboard"), {
                nickname,
                score,
                totalTime,
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
        <main className="min-h-screen relative bg-slate-950 text-white p-4 py-20 flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[url('/fantasy-bg.png')] bg-cover bg-center mix-blend-overlay opacity-20 pointer-events-none" />

            <AnimatePresence mode="wait">
                {gameState === "lobby" && (
                    <motion.div
                        key="lobby"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full max-w-2xl z-10 space-y-8"
                    >
                        <div className="text-center space-y-2">
                            <h1 className="text-4xl font-black gold-text tracking-widest uppercase">
                                Score Attack
                            </h1>
                            <p className="text-amber-200/50 font-bold tracking-widest uppercase text-xs">
                                スコアアタックモード
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                            <Card className="fantasy-card border-none bg-black/60 p-6 space-y-6">
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
                                        <span className="gold-text italic uppercase">Top 10 Rankings</span>
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
                                            戦績データがありません
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>

                        <AdBanner adSlot="solo_lobby_bottom" />

                        <div className="flex justify-center">
                            <Button variant="ghost" onClick={() => router.push("/")} className="text-white/30 hover:text-amber-500">
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

                        <Card className="fantasy-card border-none bg-black/60 p-10 pt-16 space-y-8 relative !overflow-visible">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-10 py-3 bg-amber-950 border-2 border-amber-500 rounded-full text-amber-500 font-black tracking-[0.2em] z-10 whitespace-nowrap">
                                YOUR RESULT
                            </div>

                            <div className="pt-4 space-y-1">
                                <p className="text-6xl font-black font-mono gold-text italic tracking-tighter">
                                    {score} <span className="text-2xl not-italic tracking-normal">pt</span>
                                </p>
                                <p className="text-amber-200/40 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                                    <Timer className="h-4 w-4" /> Total Time: {totalTime.toFixed(1)}s
                                </p>
                            </div>

                            <div className="flex flex-col gap-4">
                                <Button
                                    onClick={() => setGameState("lobby")}
                                    className="w-full h-16 text-lg font-black fantasy-button text-amber-100"
                                >
                                    もう一度挑戦する
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setGameState("lobby")}
                                    className="w-full h-14 border-amber-900/50 text-amber-200/50 hover:bg-white/5"
                                >
                                    タイトルに戻る
                                </Button>
                            </div>

                            <div className="pt-4">
                                <AdBanner adSlot="solo_result_bottom" />
                            </div>
                        </Card>

                        <div className="flex items-center justify-center gap-2 text-white/20 font-black tracking-[0.4em] text-[10px] uppercase">
                            Glory awaits the swift
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
