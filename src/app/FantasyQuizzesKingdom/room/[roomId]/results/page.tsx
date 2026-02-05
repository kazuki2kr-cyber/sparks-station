"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { collection, onSnapshot, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trophy, Home, Crown, Star, Sparkles, Sword, Scroll, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
// import AdBanner from "@/components/AdBanner";
import ScoreCard from "@/app/FantasyQuizzesKingdom/components/ScoreCard";

export default function GuestResults() {
    const { roomId } = useParams() as { roomId: string };
    const { user, loading: authLoading } = useAuth();
    const [players, setPlayers] = useState<any[]>([]);
    const [myRank, setMyRank] = useState<number | null>(null);
    const [myPlayer, setMyPlayer] = useState<any>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (authLoading || !user) return;

        const playersRef = collection(db, "rooms", roomId, "players");
        const unsubscribe = onSnapshot(playersRef, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            list.sort((a: any, b: any) => b.score - a.score || a.totalTime - b.totalTime);
            setPlayers(list);

            const rank = list.findIndex(p => p.id === user.uid);
            if (rank !== -1) {
                setMyRank(rank + 1);
                setMyPlayer(list[rank]);
            }
        });

        // Fetch questions for review
        const fetchQuestions = async () => {
            const questionsRef = collection(db, "rooms", roomId, "questions");
            const snapshot = await getDocs(questionsRef);
            const qs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            qs.sort((a: any, b: any) => (a.createdAt || 0) - (b.createdAt || 0));
            setQuestions(qs);
        }
        fetchQuestions();

        return () => unsubscribe();
    }, [roomId, user, authLoading]);

    // Tallying Effect
    const [isTallying, setIsTallying] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsTallying(false);
        }, 4000); // 4 seconds dramatic wait
        return () => clearTimeout(timer);
    }, []);

    if (!myPlayer) return null;

    const topThree = players.slice(0, 3);

    return (
        <div className="min-h-screen relative bg-slate-950 text-white p-4 py-12 flex flex-col items-center overflow-x-hidden">
            <div className="absolute inset-0 bg-[url('/fantasy-bg.png')] bg-cover bg-center mix-blend-overlay opacity-20 pointer-events-none" />

            <AnimatePresence mode="wait">
                {isTallying ? (
                    <motion.div
                        key="tallying"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm gap-8"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-amber-500 blur-3xl opacity-20 animate-pulse" />
                            <Sword className="h-24 w-24 text-amber-500 animate-spin-slow relative z-10" />
                        </div>
                        <div className="text-center space-y-2 relative z-10">
                            <h2 className="text-3xl font-black italic gold-text tracking-widest uppercase animate-pulse">
                                集計中...
                            </h2>
                            <p className="text-amber-200/50 text-xs font-bold tracking-[0.5em] uppercase">
                                Tallying Scores
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    <div className="max-w-4xl w-full space-y-12 relative z-10">
                        <header className="text-center space-y-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: "spring", damping: 10, stiffness: 100 }}
                            >
                                <Trophy className="h-20 w-20 text-amber-500 mx-auto drop-shadow-[0_0_30px_rgba(251,191,36,0.6)]" />
                            </motion.div>
                            <h1 className="text-5xl font-black italic gold-text tracking-widest uppercase mb-2">最終結果</h1>
                            <p className="text-amber-200/70 font-bold tracking-[0.2em] uppercase">参加者たちの最終記録</p>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            {/* My Result Card - ScoreCard Implementation */}
                            <motion.div
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="flex flex-col gap-4"
                            >
                                <ScoreCard
                                    playerName={myPlayer.name}
                                    genre="BATTLE" // Multi uses room category, but hardcoded or derived. Let's use fixed generic or try to fetch room info if possible, but simplicity: BATTLE
                                    score={myPlayer.score}
                                    rank={`${myRank} / ${players.length}`}
                                    rankLabel="POSITION"
                                />

                                <Button
                                    onClick={() => {
                                        // OGP Share URL
                                        const shareUrl = new URL(`${window.location.origin}/share/result`);
                                        shareUrl.searchParams.set('name', myPlayer.name);
                                        shareUrl.searchParams.set('score', myPlayer.score.toString());
                                        shareUrl.searchParams.set('rank', `${myRank} / ${players.length}`);
                                        shareUrl.searchParams.set('genre', 'BATTLE');
                                        shareUrl.searchParams.set('rankLabel', 'POSITION');

                                        const text = `【TRIAL RECORD】\n#FantasyQuizzesKingdom #SparksStation #クイズバトル`;
                                        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl.toString())}`, '_blank');
                                    }}
                                    className="w-full h-14 bg-black text-white hover:bg-black/80 font-bold rounded-xl border border-white/10 flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                                    結果をXでポスト
                                </Button>
                            </motion.div>

                            {/* Result Review Section (Only for me) */}
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="w-full md:col-span-1"
                            >
                                <Card className="fantasy-card border-none bg-black/60 w-full mb-8">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                                            <Scroll className="h-5 w-5 text-amber-500" />
                                            <span className="text-amber-100">プレイ記録</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                                        {questions.map((q, idx) => {
                                            const ans = myPlayer.answers?.[q.id];
                                            const isCorrect = ans?.isCorrect;
                                            const timeTaken = ans?.timeTaken || 0;
                                            // Handle case where answer might be missing or old format
                                            const selectedIndex = ans?.selectedOption !== undefined ? ans.selectedOption : -1;
                                            const skipped = ans === undefined;

                                            return (
                                                <div key={q.id} className={`p-3 rounded-xl border flex flex-col gap-2 ${isCorrect ? "bg-green-900/10 border-green-500/30" : "bg-red-900/10 border-red-500/30"
                                                    }`}>
                                                    <div className="flex justify-between items-start gap-3">
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="outline" className={`${isCorrect ? "border-green-500 text-green-400" : "border-red-500 text-red-400"
                                                                } h-6 w-6 rounded-full p-0 flex items-center justify-center shrink-0`}>
                                                                {isCorrect ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                                                            </Badge>
                                                            <span className="text-xs font-bold text-amber-500/70">Q{idx + 1}</span>
                                                        </div>
                                                        <span className="text-[10px] font-mono text-white/40">{timeTaken.toFixed(2)}s</span>
                                                    </div>

                                                    <p className="text-sm font-bold text-left leading-snug text-white/90">
                                                        {q.text}
                                                    </p>

                                                    {q.imageUrl && (
                                                        <div className="my-1">
                                                            <Image src={q.imageUrl} alt="q" width={100} height={60} className="h-16 w-auto object-contain rounded border border-white/5" />
                                                        </div>
                                                    )}

                                                    <div className="text-xs space-y-1 mt-1 text-left bg-black/20 p-2 rounded">
                                                        <div className="flex gap-2">
                                                            <span className="text-white/40 w-10 shrink-0">正解:</span>
                                                            <span className="text-green-400 font-bold">{q.choices?.[q.correctAnswer]}</span>
                                                        </div>
                                                        {!isCorrect && (
                                                            <div className="flex gap-2">
                                                                <span className="text-white/40 w-10 shrink-0">回答:</span>
                                                                <span className="text-red-400 font-bold line-through decoration-red-500/50">
                                                                    {skipped ? "回答なし" : (selectedIndex === -1 ? "不明" : q.choices?.[selectedIndex])}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </Card>
                            </motion.div>

                            {/* Podium for top 3 */}
                            <div className="space-y-6">
                                <h2 className="gold-text text-2xl font-black italic flex items-center gap-3 tracking-widest uppercase">
                                    <Crown className="h-7 w-7 text-amber-500" />
                                    ランキング
                                </h2>
                                <div className="space-y-4">
                                    {topThree.map((player, idx) => (
                                        <motion.div
                                            key={player.id}
                                            initial={{ x: 50, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: idx * 0.2 }}
                                            className={`flex items-center justify-between p-5 rounded-3xl border transition-all ${idx === 0 ? "bg-amber-500/10 border-amber-500 animate-pulse-slow shadow-[0_0_20px_rgba(251,191,36,0.1)]" : "bg-white/5 border-white/10"
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${idx === 0 ? "bg-amber-500 text-black shadow-[0_0_10px_rgba(251,191,36,0.5)]" :
                                                    idx === 1 ? "bg-slate-300 text-black" :
                                                        idx === 2 ? "bg-amber-800 text-white" : ""
                                                    }`}>
                                                    {idx + 1}
                                                </div>
                                                <img src={player.iconUrl} className="w-12 h-12 rounded-full border border-white/10" alt="" />
                                                <span className={`font-black tracking-wide ${idx === 0 ? "text-amber-300 text-lg" : "text-white"}`}>
                                                    {player.name}
                                                </span>
                                            </div>
                                            <span className="font-mono font-black text-amber-500 text-xl">{player.score.toLocaleString()}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="pt-12 flex flex-col items-center gap-6">
                            <div className="max-w-md w-full">
                                {/* <AdBanner adSlot="results_bottom" /> */}
                            </div>
                            <Button onClick={() => router.push("/FantasyQuizzesKingdom")} className="fantasy-button h-16 px-16 text-xl group text-amber-100">
                                <Home className="mr-3 h-6 w-6" /> ホームへ戻る
                            </Button>
                            <p className="text-white/20 text-[10px] font-black tracking-[0.6em] uppercase flex items-center gap-4">
                                <Scroll className="h-3 w-3" /> Thank you for playing!
                            </p>
                        </div>
                    </div>
                )
                }
            </AnimatePresence >
        </div >
    );
}
