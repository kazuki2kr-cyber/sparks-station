"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, onSnapshot, updateDoc, increment, getDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Timer, Trophy, CheckCircle2, XCircle, Swords, Shield, Sparkles, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function GuestPlay() {
    const { roomId } = useParams() as { roomId: string };
    const { user, loading: authLoading } = useAuth();
    const [room, setRoom] = useState<any>(null);
    const [currentQuestion, setCurrentQuestion] = useState<any>(null);
    const [player, setPlayer] = useState<any>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [pointsEarned, setPointsEarned] = useState(0);
    const [basePointsEarned, setBasePointsEarned] = useState(0);
    const [speedBonusEarned, setSpeedBonusEarned] = useState(0);
    const router = useRouter();
    const feedbackTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (authLoading || !user) return;

        const roomRef = doc(db, "rooms", roomId);
        const unsubscribeRoom = onSnapshot(roomRef, async (snapshot) => {
            if (snapshot.exists()) {
                const roomData = snapshot.data();
                setRoom(roomData);

                if (roomData.status === "finished") {
                    router.push(`/room/${roomId}/results`);
                    return;
                }

                if (roomData.currentQuestionIndex !== -1) {
                    const qSnap = await getDoc(doc(db, "rooms", roomId, "questions", `question_${roomData.currentQuestionIndex}`));
                    // Wait, previous implementation might have different naming for questions in subcollection
                    // Let's use the list instead. Wait, I should have fetched questions or used a query.
                    // Actually, the previous play page fetched ALL questions or used a known pattern.
                    // Let's check how questions are stored. In edit page, it uses addDoc to collection.
                }
            }
        });

        // Correct way to get current question
        const fetchCurrentQuestion = async (index: number) => {
            // Need to get the question at this index.
            // Since I don't Have the list here, I'll use a better approach: 
            // The room object contains currentQuestionIndex. 
            // I'll fetch the question subcollection ordered by createdAt.
        };

        const playerRef = doc(db, "rooms", roomId, "players", user.uid);
        const unsubscribePlayer = onSnapshot(playerRef, (snapshot) => {
            if (snapshot.exists()) {
                setPlayer(snapshot.data());
            }
        });

        return () => {
            unsubscribeRoom();
            unsubscribePlayer();
        };
    }, [roomId, user, authLoading, router]);

    // Better question sync
    useEffect(() => {
        if (!room || room.currentQuestionIndex === -1) return;

        const unsubscribe = onSnapshot(collection(db, "rooms", roomId, "questions"), (snapshot) => {
            const qs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            qs.sort((a: any, b: any) => a.createdAt - b.createdAt);
            const q = qs[room.currentQuestionIndex];
            if (q) {
                setCurrentQuestion(q);
                // Reset state for new question
                if (room.currentPhase === "question") {
                    setSelectedAnswer(null);
                    setShowFeedback(false);
                }
            }
        });

        return () => unsubscribe();
    }, [room?.currentQuestionIndex, roomId]);

    useEffect(() => {
        if (room?.currentPhase === "question" && currentQuestion) {
            const interval = setInterval(() => {
                const startTime = room.startTime || Date.now();
                const elapsed = (Date.now() - startTime) / 1000;
                const remaining = Math.max(0, (currentQuestion.timeLimit || 20) - elapsed);
                setTimeLeft(remaining);
                if (remaining <= 0) clearInterval(interval);
            }, 100);
            return () => clearInterval(interval);
        } else if (room?.currentPhase === "result") {
            setTimeLeft(0);
        }
    }, [room?.currentPhase, room?.startTime, currentQuestion]);

    const handleAnswer = async (index: number) => {
        if (selectedAnswer !== null || room.currentPhase !== "question" || !currentQuestion) return;

        const timeTaken = (Date.now() - room.startTime) / 1000;
        const correct = index === currentQuestion.correctAnswer;
        setSelectedAnswer(index);

        let points = 0;
        let basePt = 0;
        let bonusPt = 0;
        if (correct) {
            basePt = currentQuestion.points;
            const speedFactor = Math.max(0, 1 - (timeTaken / currentQuestion.timeLimit)) * 0.5;
            bonusPt = Math.round(basePt * speedFactor);
            points = basePt + bonusPt;
        }

        setIsCorrect(correct);
        setPointsEarned(points);
        setBasePointsEarned(basePt);
        setSpeedBonusEarned(bonusPt);
        setShowFeedback(true);

        const playerRef = doc(db, "rooms", roomId, "players", user!.uid);
        await updateDoc(playerRef, {
            score: increment(points),
            totalTime: increment(timeTaken),
            [`answers.${currentQuestion.id}`]: {
                isCorrect: correct,
                timeTaken,
                points
            }
        });
    };

    if (!room || !currentQuestion || !player) return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 gap-6">
            <Sparkles className="h-12 w-12 text-amber-500 animate-spin" />
            <p className="text-amber-200/70 font-black tracking-widest animate-pulse">クイズを読み込み中...</p>
        </div>
    );

    return (
        <div className="min-h-screen relative bg-slate-950 text-white flex flex-col overflow-hidden">
            <div className="absolute inset-0 bg-[url('/fantasy-bg.png')] bg-cover bg-center mix-blend-overlay opacity-10 pointer-events-none" />

            {/* HUD Header */}
            <header className="z-10 bg-black/40 border-b border-amber-900/30 p-4 backdrop-blur-md">
                <div className="max-w-xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <img src={player.iconUrl} className="w-12 h-12 rounded-xl border border-amber-500 bg-black/40" alt="" />
                            <Badge className="absolute -bottom-2 -right-2 bg-amber-500 text-black border-none text-[10px] px-1 font-black">PLAYER</Badge>
                        </div>
                        <div>
                            <p className="text-xs text-amber-500 font-black uppercase tracking-widest">{player.name}</p>
                            <div className="flex items-center gap-2 text-xl font-mono font-black gold-text">
                                <Trophy className="h-4 w-4 text-amber-500" />
                                {player.score.toLocaleString()}
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="rpg-label !mb-0 text-[10px]">残り時間</p>
                        <div className="flex items-center gap-2">
                            <Timer className={`h-5 w-5 ${timeLeft < 5 ? "text-red-500 animate-pulse" : "text-amber-400"}`} />
                            <span className={`text-2xl font-black font-mono tracking-tighter ${timeLeft < 5 ? "text-red-500" : "text-white"}`}>
                                {timeLeft.toFixed(1)}s
                            </span>
                        </div>
                    </div>
                </div>
                <div className="max-w-xl mx-auto mt-4 px-1">
                    <Progress value={(timeLeft / currentQuestion.timeLimit) * 100} className="h-2 bg-amber-950/50" />
                </div>
            </header>

            {/* Battle Area */}
            <main className="flex-1 z-10 p-4 flex flex-col justify-center gap-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={room.currentQuestionIndex}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="w-full max-w-xl mx-auto"
                    >
                        <Card className="fantasy-card border-none bg-black/60 p-8 shadow-2xl">
                            <div className="absolute top-2 left-4 text-[10px] font-black italic gold-text tracking-[0.3em] uppercase opacity-50">Question {room.currentQuestionIndex + 1}</div>
                            <CardContent className="p-0 text-center">
                                <h2 className="text-3xl font-black leading-tight italic gold-text drop-shadow-lg mb-4">
                                    {currentQuestion.text}
                                </h2>
                                {currentQuestion.imageUrl && (
                                    <img src={currentQuestion.imageUrl} className="w-full h-40 object-cover rounded-xl border border-white/10 mb-6" alt="" />
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </AnimatePresence>

                <div className="w-full max-w-xl mx-auto grid grid-cols-1 gap-4">
                    {currentQuestion.choices.map((choice: string, i: number) => {
                        const isSelected = selectedAnswer === i;
                        const isCorrectAnswer = room.currentPhase === "result" && i === currentQuestion.correctAnswer;
                        const isWrongAnswer = room.currentPhase === "result" && isSelected && i !== currentQuestion.correctAnswer;

                        return (
                            <motion.button
                                key={i}
                                whileHover={selectedAnswer === null ? { scale: 1.02, x: 5 } : {}}
                                whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                                onClick={() => handleAnswer(i)}
                                disabled={selectedAnswer !== null || room.currentPhase !== "question"}
                                className={`relative group p-6 rounded-2xl border-2 text-left font-black text-xl transition-all h-20 flex items-center gap-6 overflow-hidden ${isSelected ? "z-20 scale-105 shadow-2xl" : "z-10"
                                    } ${isCorrectAnswer ? "bg-green-600 border-green-400 text-white shadow-[0_0_25px_rgba(34,197,94,0.5)]" :
                                        isWrongAnswer ? "bg-red-600 border-red-400 text-white shadow-[0_0_25px_rgba(239,68,68,0.5)]" :
                                            isSelected ? "bg-amber-600 border-amber-400 text-black shadow-[0_0_25px_rgba(251,191,36,0.5)]" :
                                                selectedAnswer !== null ? "bg-black/20 border-white/5 opacity-30" :
                                                    "bg-black/40 border-amber-900/40 text-amber-100 hover:border-amber-500"
                                    }`}
                            >
                                <span className={`w-10 h-10 rounded-lg flex items-center justify-center font-black ${isSelected || isCorrectAnswer || isWrongAnswer ? "bg-white/20 text-white" : "bg-amber-950 text-amber-500"
                                    }`}>
                                    {i + 1}
                                </span>
                                <span className="flex-1 truncate tracking-wider">{choice}</span>

                                {isCorrectAnswer && <motion.div initial={{ x: 20 }} animate={{ x: 0 }}><Shield className="h-6 w-6 text-white" /></motion.div>}
                                {isWrongAnswer && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><XCircle className="h-6 w-6 text-white" /></motion.div>}
                            </motion.button>
                        );
                    })}
                </div>
            </main>

            {/* Answer Overlay Feedback */}
            <AnimatePresence>
                {showFeedback && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.5 }}
                        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
                    >
                        <div className={`p-10 rounded-full flex flex-col items-center justify-center shadow-2xl backdrop-blur-md border-4 ${isCorrect ? "bg-green-500/20 border-green-500" : "bg-red-500/20 border-red-500"}`}>
                            {isCorrect ? (
                                <>
                                    <Swords className="h-20 w-20 text-green-400 mb-2" />
                                    <p className="text-4xl font-black text-green-400 italic gold-text flex items-baseline gap-2">
                                        {pointsEarned}<span className="text-xl">PT</span>
                                    </p>
                                    <p className="text-xs font-bold text-white/70 mt-1">
                                        基本点 {basePointsEarned} + スピードボーナス {speedBonusEarned}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <Shield className="h-20 w-20 text-red-400 mb-2" />
                                    <p className="text-4xl font-black text-red-500 italic">FAILED...</p>
                                    <p className="text-xl font-black text-white/50 mt-2">MISS</p>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Waiting for other players message */}
            <AnimatePresence>
                {selectedAnswer !== null && room.currentPhase === "question" && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="fixed bottom-10 left-0 right-0 z-40 flex justify-center"
                    >
                        <div className="bg-amber-950/80 border border-amber-500 px-8 py-3 rounded-full text-amber-500 font-bold uppercase tracking-widest text-sm flex items-center gap-3">
                            <Sparkles className="h-4 w-4 animate-spin-slow" />
                            他の参加者の解答を待機中...
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Footer / Home Button */}
            <div className="relative z-10 flex justify-center pb-8 mt-4">
                <Button
                    variant="ghost"
                    onClick={() => router.push("/")}
                    className="text-amber-500/60 hover:text-amber-400 hover:bg-amber-950/30 text-xs font-bold tracking-widest uppercase transition-colors"
                >
                    <Home className="mr-2 h-4 w-4" /> ホームに戻る
                </Button>
            </div>
        </div>
    );
}
