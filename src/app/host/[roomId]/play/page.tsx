"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, onSnapshot, collection, updateDoc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Play, ChevronRight, Trophy, Timer, Swords, ShieldCheck, Crown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function HostPlay() {
    const { roomId } = useParams() as { roomId: string };
    const { user, loading: authLoading } = useAuth();
    const [room, setRoom] = useState<any>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [players, setPlayers] = useState<any[]>([]);
    const [timeLeft, setTimeLeft] = useState(0);
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
                setRoom(data);
            }
        });

        const questionsRef = query(collection(db, "rooms", roomId, "questions"), orderBy("createdAt", "asc"));
        const unsubscribeQuestions = onSnapshot(questionsRef, (snapshot) => {
            setQuestions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        const playersRef = collection(db, "rooms", roomId, "players");
        const unsubscribePlayers = onSnapshot(playersRef, (snapshot) => {
            setPlayers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => {
            unsubscribeRoom();
            unsubscribeQuestions();
            unsubscribePlayers();
        };
    }, [roomId, user, authLoading, router]);

    useEffect(() => {
        if (room?.currentPhase === "question" && questions.length > 0) {
            const interval = setInterval(() => {
                const startTime = room.startTime || Date.now(); // Fallback if missing, though ideally shouldn't happen
                const elapsed = (Date.now() - startTime) / 1000;
                const q = questions[room.currentQuestionIndex];
                const timeLimit = q?.timeLimit || 20; // Default 20s

                const remaining = Math.max(0, timeLimit - elapsed);

                if (remaining <= 0) {
                    clearInterval(interval);
                    if (room.currentPhase === "question") {
                        handleTimeUp();
                    }
                }
                setTimeLeft(remaining);
            }, 100);
            return () => clearInterval(interval);
        } else if (room?.currentPhase !== "question") {
            setTimeLeft(0);
        }
    }, [room?.currentPhase, room?.startTime, questions, room?.currentQuestionIndex]);

    const handleTimeUp = async () => {
        if (room?.currentPhase === "question") {
            await updateDoc(doc(db, "rooms", roomId), {
                currentPhase: "result"
            });
        }
    };

    const handleNextPhase = async () => {
        if (!room || questions.length === 0) return;

        if (room.currentPhase === "question") {
            // If host force-closes, go straight to result
            await updateDoc(doc(db, "rooms", roomId), {
                currentPhase: "result"
            });
        } else if (room.currentPhase === "result") {
            // Result screen should show ranking immediately? Or keep leaderboard as separate?
            // User said "解答を締めきったらその問題の結果画面を自動で表示し、次へは一度押せば次の画面に切り替わるようにしたい"
            // I will skip 'leaderboard' and go straight to next question or finished.
            const nextIndex = room.currentQuestionIndex + 1;
            if (nextIndex < questions.length) {
                const nextQ = questions[nextIndex];
                const limit = nextQ.timeLimit || 20;

                await updateDoc(doc(db, "rooms", roomId), {
                    currentQuestionIndex: nextIndex,
                    currentPhase: "question",
                    startTime: Date.now()
                });
                setTimeLeft(limit);
            } else {
                await updateDoc(doc(db, "rooms", roomId), {
                    status: "finished",
                    currentPhase: "finished"
                });
                router.push(`/host/${roomId}/results`);
            }
        }
    };

    if (!room || questions.length === 0) return null;

    const currentQuestion = questions[room.currentQuestionIndex];
    const answeredCount = players.filter(p => p.answers?.[currentQuestion?.id]).length;

    return (
        <div className="min-h-screen relative bg-slate-950 text-white p-4 md:p-8 overflow-hidden">
            <div className="absolute inset-0 bg-[url('/fantasy-bg.png')] bg-cover bg-center mix-blend-overlay opacity-30 pointer-events-none" />

            <div className="max-w-6xl mx-auto space-y-8 relative z-10">
                <header className="flex justify-between items-center">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <Swords className="h-6 w-6 text-amber-500" />
                            <h1 className="text-2xl font-black italic gold-text tracking-widest uppercase">
                                第 {room.currentQuestionIndex + 1} 問 / 全 {questions.length} 問
                            </h1>
                        </div>
                        <p className="text-amber-200/40 text-sm font-bold tracking-widest uppercase">
                            フェーズ: {room.currentPhase === "question" ? "出題中" : room.currentPhase === "result" ? "結果発表" : "ランキング発表"}
                        </p>
                    </div>
                    <div className="flex gap-4 items-center">
                        <div className="bg-black/60 border-2 border-amber-900/50 px-6 py-2 rounded-2xl flex flex-col items-center min-w-[120px]">
                            <span className="text-[10px] text-amber-500 font-black uppercase tracking-widest">残り時間</span>
                            <span className={`text-3xl font-black font-mono ${timeLeft < 5 ? "text-red-500 animate-pulse" : "text-amber-400"}`}>
                                {timeLeft.toFixed(1)}s
                            </span>
                        </div>
                        <div className="flex gap-2">
                            {room.currentPhase === "question" ? (
                                <Button
                                    size="lg"
                                    onClick={handleNextPhase}
                                    className="fantasy-button h-16 px-6 text-lg bg-red-900/80 border-red-500/50 hover:bg-red-800 text-amber-100"
                                >
                                    解答を締め切る
                                </Button>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                >
                                    <Button size="lg" onClick={handleNextPhase} className="fantasy-button h-16 px-10 text-xl group text-amber-100">
                                        {room.currentQuestionIndex === questions.length - 1 ? "クイズを終了する" : "次へ"} <ChevronRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3 space-y-8">
                        {/* Question Card */}
                        <Card className="fantasy-card border-none bg-black/40 overflow-visible">
                            <div className="absolute -top-4 -left-4 w-12 h-12 border-t-4 border-l-4 border-amber-500" />
                            <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-4 border-r-4 border-amber-500" />

                            <CardHeader className="p-10 pb-4">
                                <CardTitle className="text-4xl font-black text-center leading-tight gold-text">
                                    {currentQuestion.text}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-10 pt-4 flex flex-col items-center">
                                {currentQuestion.imageUrl ? (
                                    <img src={currentQuestion.imageUrl} alt="question" className="max-w-md w-full rounded-2xl shadow-2xl mb-8 border-4 border-amber-900/30" />
                                ) : (
                                    <div className="h-40 flex items-center justify-center opacity-10">
                                        <Timer className="h-32 w-32 text-amber-500" />
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-6 w-full mt-8">
                                    {currentQuestion.choices.map((choice: string, i: number) => (
                                        <div
                                            key={i}
                                            className={`p-6 rounded-2xl border-2 flex items-center gap-6 transition-all relative overflow-hidden ${room.currentPhase === "result" && i === currentQuestion.correctAnswer
                                                ? "bg-green-600/20 border-green-500 scale-105 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                                                : room.currentPhase === "result"
                                                    ? "bg-black/20 border-white/5 opacity-30"
                                                    : "bg-black/40 border-amber-900/30"
                                                }`}
                                        >
                                            {room.currentPhase === "result" && i === currentQuestion.correctAnswer && (
                                                <div className="absolute top-0 right-0 p-2 bg-green-500 text-black font-black text-[10px] uppercase tracking-widest rounded-bl-xl">Correct</div>
                                            )}
                                            <span className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-xl ${room.currentPhase === "result" && i === currentQuestion.correctAnswer
                                                ? "bg-green-500 text-black"
                                                : "bg-amber-950 text-amber-500"
                                                }`}>
                                                {i + 1}
                                            </span>
                                            <span className="text-2xl font-bold tracking-wide">{choice}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Answer tracking */}
                        <div className="flex gap-4">
                            <Card className="flex-1 bg-black/40 border border-amber-900/30 rounded-3xl overflow-hidden backdrop-blur-md">
                                <CardContent className="p-8 flex items-center justify-between gap-10">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 rounded-2xl bg-amber-900/20 flex items-center justify-center">
                                            <Users className="h-8 w-8 text-amber-500" />
                                        </div>
                                        <div>
                                            <p className="rpg-label !mb-0 text-sm">解答済み参加者</p>
                                            <p className="text-4xl font-black gold-text font-mono">{answeredCount} / {players.length}</p>
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex justify-between text-[10px] uppercase tracking-[0.2em] font-black text-amber-500/50">
                                            <span>Progress</span>
                                            <span>{Math.round((answeredCount / players.length) * 100)}%</span>
                                        </div>
                                        <Progress value={(answeredCount / players.length) * 100} className="h-3 bg-white/5" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Ranking Panel */}
                    <div className="space-y-6">
                        <Card className="fantasy-card border-none bg-black/60 h-[calc(100vh-200px)] sticky top-8">
                            <CardHeader className="border-b border-white/5 pb-4">
                                <CardTitle className="text-xl font-black italic gold-text flex items-center gap-3 uppercase tracking-widest">
                                    <Trophy className="h-6 w-6 text-amber-500" />
                                    現在のランキング
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 overflow-y-auto">
                                <div className="space-y-4">
                                    {players
                                        .sort((a, b) => b.score - a.score)
                                        .map((player, idx) => (
                                            <motion.div
                                                key={player.id}
                                                layout
                                                className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-amber-900/10 hover:border-amber-500/30 transition-all"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <span className={`w-6 text-sm font-black italic ${idx < 3 ? "text-amber-400" : "text-amber-800/50"}`}>
                                                        {idx + 1}
                                                    </span>
                                                    <div className="relative">
                                                        <img src={player.iconUrl} className="w-10 h-10 rounded-full border border-white/10" alt="" />
                                                        {idx === 0 && <Crown className="absolute -top-3 -left-3 h-5 w-5 text-amber-500 rotate-[-20deg]" />}
                                                    </div>
                                                    <span className="font-bold truncate max-w-[100px] text-amber-100 group-hover:text-white transition-colors">{player.name}</span>
                                                </div>
                                                <span className="font-mono font-black text-amber-500">{player.score.toLocaleString()}</span>
                                            </motion.div>
                                        ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}
