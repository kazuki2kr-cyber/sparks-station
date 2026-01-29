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
// import AdBanner from "@/components/AdBanner";
import ScoreCard from "@/app/FantasyQuizzesKingdom/components/ScoreCard";

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
        </div>
    );
}
