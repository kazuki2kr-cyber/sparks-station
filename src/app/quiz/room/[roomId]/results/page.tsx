"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trophy, Home, Crown, Star, Sparkles, Sword, Scroll } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AdBanner from "@/components/AdBanner";

export default function GuestResults() {
    const { roomId } = useParams() as { roomId: string };
    const { user, loading: authLoading } = useAuth();
    const [players, setPlayers] = useState<any[]>([]);
    const [myRank, setMyRank] = useState<number | null>(null);
    const [myPlayer, setMyPlayer] = useState<any>(null);
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

        return () => unsubscribe();
    }, [roomId, user, authLoading]);

    if (!myPlayer) return null;

    const topThree = players.slice(0, 3);

    return (
        <div className="min-h-screen relative bg-slate-950 text-white p-4 py-12 flex flex-col items-center overflow-x-hidden">
            <div className="absolute inset-0 bg-[url('/fantasy-bg.png')] bg-cover bg-center mix-blend-overlay opacity-20 pointer-events-none" />

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
                    {/* My Result Card */}
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                    >
                        <Card className="fantasy-card border-none bg-black/60 p-10 text-center relative overflow-visible">
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-10 py-3 bg-amber-950 border-2 border-amber-500 rounded-full text-amber-500 font-black tracking-widest text-lg shadow-2xl">
                                YOUR RANK
                            </div>

                            <div className="pt-8 space-y-6">
                                <div className="relative inline-block">
                                    <div className="text-8xl font-black italic gold-text tracking-tighter drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]">
                                        #{myRank}
                                    </div>
                                    <div className="absolute -top-4 -right-8 h-12 w-12 bg-amber-500 text-black rounded-full flex items-center justify-center font-black animate-bounce">
                                        <Star className="h-6 w-6 fill-current" />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-2xl font-black text-white">{myPlayer.name} 様</p>
                                    <p className="text-amber-200/40 text-sm italic font-bold">
                                        {myRank === 1 ? "優勝おめでとうございます！" :
                                            myRank! <= 3 ? "TOP3入賞おめでとう！" :
                                                "ナイスチャレンジ！"}
                                    </p>
                                </div>

                                <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                                    <div className="text-left p-4 rounded-xl bg-black/30 border border-white/5">
                                        <p className="rpg-label text-[10px]">スコア (Score)</p>
                                        <p className="font-mono text-2xl font-black text-amber-400">{myPlayer.score.toLocaleString()} pt</p>
                                    </div>
                                    <div className="text-left p-4 rounded-xl bg-black/30 border border-white/5">
                                        <p className="rpg-label text-[10px]">合計時間 (Time)</p>
                                        <p className="font-mono text-2xl font-black text-white">{myPlayer.totalTime.toFixed(1)}s</p>
                                    </div>
                                </div>
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
                        <AdBanner adSlot="results_bottom" />
                    </div>
                    <Button onClick={() => router.push("/")} className="fantasy-button h-16 px-16 text-xl group text-amber-100">
                        <Home className="mr-3 h-6 w-6" /> ホームへ戻る
                    </Button>
                    <p className="text-white/20 text-[10px] font-black tracking-[0.6em] uppercase flex items-center gap-4">
                        <Scroll className="h-3 w-3" /> Thank you for playing!
                    </p>
                </div>
            </div>
        </div>
    );
}
