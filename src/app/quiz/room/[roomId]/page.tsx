"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, onSnapshot, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Users, Crown, Sword, Shield, Scroll, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AdBanner from "@/components/AdBanner";

export default function GuestLobby() {
    const { roomId } = useParams() as { roomId: string };
    const { user, loading: authLoading } = useAuth();
    const [roomStatus, setRoomStatus] = useState<string>("waiting");
    const [nickname, setNickname] = useState("");
    const [selectedIcon, setSelectedIcon] = useState("");
    const [isJoined, setIsJoined] = useState(false);
    const [roomExists, setRoomExists] = useState<boolean | null>(null);
    const router = useRouter();

    // Generate 100 character icons using DiceBear
    const animalIcons = useMemo(() => {
        return Array.from({ length: 100 }).map((_, i) => ({
            id: i,
            url: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${i + 123}` // Using pixel art for RPG feel
        }));
    }, []);

    useEffect(() => {
        if (authLoading) return;

        const roomRef = doc(db, "rooms", roomId);
        const unsubscribe = onSnapshot(roomRef, (snapshot) => {
            if (snapshot.exists()) {
                setRoomExists(true);
                const data = snapshot.data();
                setRoomStatus(data.status);

                if (data.status === "playing" && isJoined) {
                    router.push(`/room/${roomId}/play`);
                }
            } else {
                setRoomExists(false);
            }
        });

        // Check if player is already in this room
        if (user) {
            getDoc(doc(db, "rooms", roomId, "players", user.uid)).then((docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setNickname(data.name);
                    setSelectedIcon(data.iconUrl);
                    setIsJoined(true);
                }
            });
        }

        return () => unsubscribe();
    }, [roomId, isJoined, user, authLoading, router]);

    const handleJoin = async () => {
        if (!user || !nickname || !selectedIcon) return;

        await setDoc(doc(db, "rooms", roomId, "players", user.uid), {
            name: nickname,
            iconUrl: selectedIcon,
            score: 0,
            totalTime: 0,
            joinedAt: Date.now(),
            answers: {}
        });

        setIsJoined(true);
    };

    if (roomExists === false) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
                <Card className="fantasy-card border-none bg-black/40 text-center p-12">
                    <h1 className="text-3xl font-black gold-text mb-4">ルームが見つかりません</h1>
                    <p className="text-amber-200/70 mb-8 font-bold">指定された参加コードのルームは見つかりませんでした。</p>
                    <Button onClick={() => router.push("/")} className="fantasy-button px-10">ホームに戻る</Button>
                </Card>
            </div>
        );
    }

    if (!isJoined) {
        return (
            <div className="min-h-screen relative bg-slate-950 text-white p-4 py-12 md:p-12 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-[url('/fantasy-bg.png')] bg-cover bg-center mix-blend-overlay opacity-20 pointer-events-none" />

                <div className="max-w-4xl w-full space-y-8 relative z-10">
                    <header className="text-center space-y-2">
                        <motion.h1
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-4xl font-black gold-text italic tracking-[0.2em] uppercase"
                        >
                            参加登録
                        </motion.h1>
                        <p className="text-amber-200/70 text-sm font-bold tracking-widest">クイズに参加するための名前とアイコンを決めましょう</p>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card className="fantasy-card border-none bg-black/40 p-8 space-y-8">
                            <div className="space-y-4">
                                <label className="rpg-label">ニックネーム</label>
                                <Input
                                    placeholder="名前を入力..."
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    className="h-14 bg-black/40 border-amber-900/50 text-white text-xl focus:border-amber-500 transition-colors"
                                />
                            </div>

                            <div className="pt-6 border-t border-white/5 space-y-4 text-center">
                                <p className="text-amber-200/70 text-xs italic leading-relaxed">
                                    入力した名前はランキングや結果画面に表示されます。
                                </p>
                                <Button
                                    onClick={handleJoin}
                                    disabled={!nickname || !selectedIcon}
                                    className="w-full h-20 text-xl font-black fantasy-button group text-amber-100"
                                >
                                    参加する <Sword className="ml-3 h-6 w-6 group-hover:rotate-12 transition-transform" />
                                </Button>
                            </div>
                        </Card>

                        <Card className="fantasy-card border-none bg-black/60 p-6">
                            <CardHeader className="p-0 pb-4">
                                <CardTitle className="text-lg font-bold flex items-center justify-between">
                                    <span className="gold-text italic">アイコン選択</span>
                                    <Badge variant="outline" className="text-amber-500 border-amber-900/50">{selectedIcon ? "準備完了" : "未選択"}</Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 pr-2">
                                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                                    {animalIcons.map((icon) => (
                                        <button
                                            key={icon.id}
                                            onClick={() => setSelectedIcon(icon.url)}
                                            className={`aspect-square rounded-xl border-2 transition-all p-1 flex items-center justify-center hover:scale-110 active:scale-95 ${selectedIcon === icon.url
                                                ? "bg-amber-500/20 border-amber-500 shadow-[0_0_15px_rgba(251,191,36,0.3)]"
                                                : "bg-black/40 border-white/5 hover:border-white/20"
                                                }`}
                                        >
                                            <img src={icon.url} alt="" className="w-full h-full" />
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative bg-slate-950 text-white p-4 py-20 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[url('/fantasy-bg.png')] bg-cover bg-center mix-blend-overlay opacity-30 pointer-events-none" />

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="max-w-2xl w-full z-10 text-center space-y-12"
            >
                <div>
                    <div className="relative inline-block mb-10">
                        <img src={selectedIcon} className="w-40 h-40 rounded-3xl border-4 border-amber-500 shadow-[0_0_40px_rgba(251,191,36,0.2)] bg-black/40 p-4" alt="" />
                        <div className="absolute -top-6 -right-6 w-16 h-16 bg-amber-500 text-black rounded-full flex items-center justify-center shadow-2xl border-4 border-black animate-bounce">
                            <Shield className="h-8 w-8" />
                        </div>
                    </div>
                    <h1 className="text-5xl font-black gold-text italic mb-4">{nickname} さん</h1>
                    <p className="text-amber-200/70 font-bold tracking-[0.3em] uppercase">ルームへの参加が完了しました</p>
                </div>

                <Card className="fantasy-card border-none bg-black/60 p-10 relative overflow-visible">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-8 py-2 bg-amber-950 border-2 border-amber-500 rounded-full text-amber-500 font-bold tracking-widest text-xs uppercase shadow-xl">
                        現在のステータス
                    </div>

                    <div className="space-y-6 pt-4">
                        <div className="flex items-center justify-center gap-4">
                            <div className="relative">
                                <span className="absolute inset-0 animate-ping rounded-full bg-amber-500 opacity-20"></span>
                                <div className="h-4 w-4 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.8)]"></div>
                            </div>
                            <p className="text-3xl font-black tracking-tight text-white uppercase italic">
                                ホストの開始合図を待機中...
                            </p>
                        </div>
                        <p className="text-amber-200/70 text-sm leading-relaxed max-w-md mx-auto italic">
                            間もなくクイズが開始されます。そのままお待ちください。<br />
                            <span className="mt-4 block font-bold text-amber-500">
                                早押しバトルの極意：<br />
                                1. 問題が表示されたら即座に回答を選択してください。<br />
                                2. 正解すると基本ポイントが入ります。<br />
                                3. 早く答えるほど、最大で基本点の50％のスピードボーナスが獲得できます！
                            </span>
                        </p>
                    </div>

                    <div className="mt-10 pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
                        <div className="text-left p-4 rounded-xl bg-black/20">
                            <p className="rpg-label mb-0">ルームID</p>
                            <p className="font-mono text-xl font-black text-amber-500">{roomId}</p>
                        </div>
                        <div className="text-left p-4 rounded-xl bg-black/20">
                            <p className="rpg-label mb-0">ルーム名</p>
                            <p className="font-black text-white truncate italic">Fantasy Quizzes Kingdom</p>
                        </div>
                    </div>
                </Card>

                <div className="flex justify-center pb-8">
                    <Button
                        variant="ghost"
                        onClick={() => router.push("/")}
                        className="text-amber-500/60 hover:text-amber-400 hover:bg-amber-950/30 text-xs font-bold tracking-widest uppercase transition-colors"
                    >
                        <Home className="mr-2 h-4 w-4" /> ホームに戻る
                    </Button>
                </div>

                <div className="max-w-md mx-auto">
                    <AdBanner adSlot="lobby_bottom" />
                </div>

                <div className="flex justify-center gap-4 text-white/20 font-black tracking-[0.4em] text-[10px] uppercase pt-12">
                    <span className="flex items-center gap-2"><Sparkles className="h-3 w-3" /> Magic</span>
                    <span className="flex items-center gap-2"><Crown className="h-3 w-3" /> Wisdom</span>
                    <span className="flex items-center gap-2"><Sword className="h-3 w-3" /> Power</span>
                </div>
            </motion.div>
        </div>
    );
}
