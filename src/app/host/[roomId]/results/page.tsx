"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { collection, onSnapshot, doc, deleteDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trophy, Home, RotateCcw, Users, Download, Trash2, Crown, Sparkles, Scroll } from "lucide-react";
import { motion } from "framer-motion";

export default function HostResults() {
    const { roomId } = useParams() as { roomId: string };
    const { user, loading: authLoading } = useAuth();
    const [players, setPlayers] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (authLoading || !user) return;

        const playersRef = collection(db, "rooms", roomId, "players");
        const unsubscribe = onSnapshot(playersRef, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            list.sort((a: any, b: any) => b.score - a.score || a.totalTime - b.totalTime);
            setPlayers(list);
        });

        return () => unsubscribe();
    }, [roomId, user, authLoading]);

    const handleResetGame = async () => {
        const playersRef = collection(db, "rooms", roomId, "players");
        const snapshot = await getDocs(playersRef);
        for (const d of snapshot.docs) {
            await updateDoc(d.ref, {
                score: 0,
                totalTime: 0,
                answers: {}
            });
        }

        await updateDoc(doc(db, "rooms", roomId), {
            status: "waiting",
            currentQuestionIndex: -1,
            currentPhase: "waiting"
        });

        router.push(`/host/${roomId}`);
    };

    const handleDeleteRoom = async () => {
        if (confirm("ルームを削除しますか？この操作は取り消せません。")) {
            await deleteDoc(doc(db, "rooms", roomId));
            router.push("/");
        }
    };

    if (!players.length) return null;

    return (
        <div className="min-h-screen relative bg-slate-950 text-white p-4 md:p-12 overflow-hidden">
            <div className="absolute inset-0 bg-[url('/fantasy-bg.png')] bg-cover bg-center mix-blend-overlay opacity-30 pointer-events-none" />

            <div className="max-w-5xl mx-auto space-y-12 relative z-10">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-2">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex items-center gap-4"
                        >
                            <Trophy className="h-10 w-10 text-amber-500 shadow-[0_0_20px_rgba(251,191,36,0.5)]" />
                            <h1 className="text-4xl font-black gold-text italic tracking-widest uppercase">
                                最終結果
                            </h1>
                        </motion.div>
                        <p className="text-amber-200/70 font-bold tracking-[0.2em] uppercase text-sm">クイズは終了し、参加者の順位が決まりました</p>
                    </div>
                    <div className="flex gap-4">
                        <Button onClick={handleResetGame} variant="outline" className="h-14 border-amber-900/50 hover:bg-amber-900/20 text-amber-200 px-8">
                            <RotateCcw className="mr-2 h-5 w-5" />
                            もう一度遊ぶ
                        </Button>
                        <Button onClick={() => router.push("/")} className="fantasy-button h-14 px-10 text-lg text-amber-100">
                            <Home className="mr-2 h-5 w-5" />
                            ホームに戻る
                        </Button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="fantasy-card border-none bg-black/40 p-8">
                            <CardTitle className="text-2xl font-black gold-text mb-8 flex items-center gap-3">
                                <Scroll className="h-6 w-6 text-amber-500" />
                                最終ランキング
                            </CardTitle>
                            <div className="space-y-4">
                                {players.map((player, idx) => (
                                    <motion.div
                                        key={player.id}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className={`flex items-center justify-between p-6 rounded-3xl border transition-all ${idx === 0 ? "bg-amber-500/10 border-amber-500 shadow-[0_0_20px_rgba(251,191,36,0.1)]" :
                                            idx < 3 ? "bg-white/5 border-white/10" : "bg-black/20 border-white/5 opacity-80"
                                            }`}
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl relative ${idx === 0 ? "bg-amber-500 text-black shadow-[0_0_15px_rgba(251,191,36,0.5)]" :
                                                idx === 1 ? "bg-slate-300 text-black" :
                                                    idx === 2 ? "bg-amber-800 text-amber-100" :
                                                        "bg-black/40 text-white/30 border border-white/10"
                                                }`}>
                                                {idx + 1}
                                                {idx === 0 && <Crown className="absolute -top-4 -left-4 h-6 w-6 text-amber-500 drop-shadow-lg rotate-[-20deg]" />}
                                            </div>
                                            <img src={player.iconUrl} alt="" className="w-14 h-14 rounded-full border-2 border-white/10" />
                                            <div>
                                                <p className={`text-xl font-black ${idx === 0 ? "text-amber-300" : "text-white"}`}>{player.name}</p>
                                                <p className="rpg-label !mb-0 text-[10px] opacity-50">
                                                    {idx === 0 ? "優勝" : idx === 1 ? "2位" : idx === 2 ? "3位" : "参加者"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-mono font-black text-3xl gold-text">{player.score.toLocaleString()}</p>
                                            <p className="text-xs text-amber-500/40 font-bold uppercase tracking-widest">{player.totalTime.toFixed(1)}s TOTAL</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-8">
                        <Card className="fantasy-card border-none bg-black/60 sticky top-8">
                            <CardHeader className="border-b border-white/5">
                                <CardTitle className="gold-text italic flex items-center gap-2">結果レポート</CardTitle>
                                <CardDescription className="text-amber-200/30">クイズの統計</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-8 space-y-8">
                                <div className="flex items-center justify-between">
                                    <span className="text-amber-100/40 font-bold uppercase tracking-widest flex items-center gap-2">
                                        <Users className="h-4 w-4" /> 参加人数
                                    </span>
                                    <span className="text-2xl font-black text-white">{players.length} 名</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-amber-100/40 font-bold uppercase tracking-widest flex items-center gap-2">
                                        <Sparkles className="h-4 w-4" /> 平均スコア
                                    </span>
                                    <span className="text-2xl font-black text-amber-400 font-mono">
                                        {Math.round(players.reduce((acc, p) => acc + p.score, 0) / players.length).toLocaleString()}
                                    </span>
                                </div>

                                <div className="space-y-3 pt-6 border-t border-white/5">
                                    <Button variant="ghost" className="w-full justify-start text-amber-200/70 hover:text-amber-400 hover:bg-amber-900/10 h-14 px-6 rounded-2xl">
                                        <Download className="mr-3 h-5 w-5" /> 結果をCSVでダウンロード
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start text-red-400/50 hover:text-red-400 hover:bg-red-900/10 h-14 px-6 rounded-2xl"
                                        onClick={handleDeleteRoom}
                                    >
                                        <Trash2 className="mr-3 h-5 w-5" /> ルームを削除する
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
