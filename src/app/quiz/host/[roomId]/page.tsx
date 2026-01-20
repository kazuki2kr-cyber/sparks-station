"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, onSnapshot, collection, updateDoc, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Settings, Play, ChevronRight, Copy, Share2, Crown, ScrollText, Home } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface Player {
    id: string;
    name: string;
    iconUrl: string;
    joinedAt: number;
}

export default function HostDashboard() {
    const { roomId } = useParams() as { roomId: string };
    const { user, loading: authLoading } = useAuth();
    const [players, setPlayers] = useState<Player[]>([]);
    const [roomStatus, setRoomStatus] = useState<string>("waiting");
    const [hostName, setHostName] = useState<string>("");
    const [roomName, setRoomName] = useState<string>("Fantasy Room");
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        if (authLoading || !user) return;

        const roomRef = doc(db, "rooms", roomId);
        const unsubscribeRoom = onSnapshot(roomRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data();
                if (data.hostId !== user.uid) {
                    router.push("/");
                    return;
                }
                setRoomStatus(data.status);
                setHostName(data.hostName);
                if (data.roomName) setRoomName(data.roomName);
            } else {
                router.push("/");
            }
        });

        const playersRef = collection(db, "rooms", roomId, "players");
        const unsubscribePlayers = onSnapshot(playersRef, (snapshot) => {
            setPlayers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Player)));
        });

        return () => {
            unsubscribeRoom();
            unsubscribePlayers();
        };
    }, [roomId, user, authLoading, router]);

    const handleCopyInvite = () => {
        const url = `${window.location.origin}/room/${roomId}`;
        navigator.clipboard.writeText(url);
        toast({
            title: "召喚コードをコピーしました",
            description: "冒険者たちにこのURLを共有してください！",
        });
    };

    const handleUpdateRoomName = async () => {
        if (!roomName.trim()) return;
        await updateDoc(doc(db, "rooms", roomId), {
            roomName: roomName
        });
        toast({
            title: "ルーム名を変更しました",
            description: roomName,
        });
    };

    const handleStartGame = async () => {
        if (players.length === 0) {
            toast({
                title: "冒険者がいません",
                description: "少なくとも一人のプレイヤーが参加する必要があります。",
                variant: "destructive",
            });
            return;
        }

        await updateDoc(doc(db, "rooms", roomId), {
            status: "playing",
            currentQuestionIndex: 0,
            currentPhase: "question",
            startTime: Date.now(),
        });

        router.push(`/host/${roomId}/play`);
    };

    if (!user) return null;

    return (
        <div className="min-h-screen relative bg-slate-950 text-white p-4 md:p-8 overflow-hidden">
            {/* Redesigned Host Layout */}
            <div className="absolute inset-0 bg-[url('/fantasy-bg.png')] bg-cover bg-center mix-blend-overlay opacity-20 pointer-events-none" />

            <div className="max-w-5xl mx-auto space-y-8 relative z-10">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-amber-900/30 pb-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <Crown className="h-8 w-8 text-amber-500 animate-pulse" />
                            <h1 className="text-4xl font-black gold-text italic tracking-tight">クイズ管理者画面</h1>
                        </div>
                        <p className="text-amber-200/70 font-medium">クイズの設定などルームの管理が行えます</p>
                        <div className="pt-2">
                            <label className="text-xs font-bold text-amber-500/80 uppercase tracking-widest pl-1">ルーム名</label>
                            <Input
                                value={roomName}
                                onChange={(e) => setRoomName(e.target.value)}
                                onBlur={handleUpdateRoomName}
                                className="bg-black/40 border-amber-900/50 text-white font-bold h-10 mt-1 max-w-md focus:border-amber-500 transition-colors font-serif tracking-wider"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-black/40 border border-amber-900/50 rounded-2xl p-4 flex items-center gap-4 backdrop-blur-md">
                            <div>
                                <p className="rpg-label">参加コード</p>
                                <p className="text-3xl font-black font-mono tracking-tighter text-amber-400">{roomId}</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={handleCopyInvite} className="hover:bg-amber-900/20 text-amber-400">
                                <Copy className="h-6 w-6" />
                            </Button>
                        </div>
                        <Button onClick={handleStartGame} size="lg" className="h-20 px-10 rounded-2xl bg-amber-600 hover:bg-amber-500 text-black font-black text-xl shadow-xl shadow-amber-900/20 group">
                            クイズを開始する <Play className="ml-2 fill-current group-hover:scale-125 transition-transform" />
                        </Button>
                    </div>
                </header>

                {/* Primary Action: Create Questions */}
                <Button
                    onClick={() => router.push(`/host/${roomId}/edit`)}
                    className="w-full text-2xl h-24 fantasy-button border-2 border-amber-500/50 shadow-[0_0_20px_rgba(251,191,36,0.2)] hover:scale-[1.01] transition-transform text-amber-100"
                >
                    <Settings className="mr-3 h-8 w-8" />
                    <div className="flex flex-col items-start">
                        <span className="font-black tracking-widest">新しいクイズを作成する（問題管理）</span>
                        <span className="text-sm font-normal opacity-70">問題を作成しましょう</span>
                    </div>
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Status Card */}
                        <Card className="fantasy-card border-none">
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                        <ScrollText className="h-6 w-6 text-amber-500" />
                                        現在のステータス
                                    </CardTitle>
                                    <Badge variant="outline" className="px-4 py-1 border-amber-500 text-amber-400 font-bold uppercase tracking-widest">
                                        {roomStatus === "waiting" ? "待機中" : "進行中"}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="p-4 rounded-xl bg-black/30 border border-white/5 flex justify-between items-center">
                                        <p className="rpg-label">現在のフェーズ</p>
                                        <p className="text-xl font-bold">{roomStatus === "waiting" ? "参加待機中" : "クイズ進行中"}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Players Section */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <h2 className="text-2xl font-black italic gold-text flex items-center gap-3">
                                    <Users className="h-7 w-7" />
                                    参加者一覧 ({players.length})
                                </h2>
                            </div>
                            {players.length === 0 ? (
                                <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-amber-900/30 rounded-3xl bg-black/10">
                                    <Users className="h-16 w-16 text-amber-900/30 mb-4" />
                                    <p className="text-amber-200/30 font-bold">参加者を待っています...</p>
                                    <Button variant="link" onClick={handleCopyInvite} className="text-amber-500 font-bold mt-2">招待リンクを共有</Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    <AnimatePresence>
                                        {players.map((player) => (
                                            <motion.div
                                                key={player.id}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                className="p-4 rounded-2xl bg-black/50 border border-amber-900/40 flex items-center gap-4 group hover:border-amber-500 transition-colors"
                                            >
                                                <div className="relative">
                                                    <img src={player.iconUrl} className="w-12 h-12 rounded-full border-2 border-amber-500/50" alt="" />
                                                </div>
                                                <div className="truncate">
                                                    <p className="font-black text-amber-100 group-hover:text-white transition-colors capitalize">{player.name}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <Card className="fantasy-card border-none h-full">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold flex items-center gap-2">
                                    クイズ管理者の心得
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm text-amber-100/60 leading-relaxed italic">
                                <p>1. クイズの内容はいつでも「新しいクイズを作成する」から変更可能です。</p>
                                <p>2. 各問題には制限時間と配点が設定できます。難易度に応じて調整しましょう。</p>
                                <p>3. 全員の準備ができたら「クイズを開始する」を押してください。</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                {/* Footer / Home Button */}
                <div className="relative z-10 flex justify-center pb-8 mt-12">
                    <Button
                        variant="ghost"
                        onClick={() => router.push("/")}
                        className="text-amber-500/60 hover:text-amber-400 hover:bg-amber-950/30 text-xs font-bold tracking-widest uppercase transition-colors"
                    >
                        <Home className="mr-2 h-4 w-4" /> ホームに戻る
                    </Button>
                </div>

            </div>
        </div>
    );
}
