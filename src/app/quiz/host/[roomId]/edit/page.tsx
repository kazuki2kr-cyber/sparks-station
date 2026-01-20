"use client";

import { useEffect, useState, memo } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, onSnapshot, collection, updateDoc, query, orderBy, deleteDoc, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Trash2, Save, ArrowLeft, Clock, Trophy, Scroll } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface Question {
    id?: string;
    text: string;
    choices: string[];
    correctAnswer: number;
    timeLimit: number;
    points: number;
    imageUrl?: string;
    createdAt?: number;
}

// Memoized Question Item Component to handle local state specifically for IME issues
const QuestionItem = memo(({
    q,
    idx,
    onUpdate,
    onDelete
}: {
    q: Question,
    idx: number,
    onUpdate: (id: string, data: Partial<Question>) => void,
    onDelete: (id: string) => void
}) => {
    // Local state for text inputs to allow smooth IME composition
    const [localText, setLocalText] = useState(q.text);
    const [localChoices, setLocalChoices] = useState([...q.choices]);
    const [localTimeLimit, setLocalTimeLimit] = useState(q.timeLimit);
    const [localPoints, setLocalPoints] = useState(q.points);

    // Sync local state when prop updates (only if needed, e.g. from other users)
    // We skip this if the user is actively typing to avoid overwriting, 
    // but for now simple sync is okay as long as we don't trigger updates on keystroke.
    useEffect(() => {
        setLocalText(q.text);
    }, [q.text]);

    useEffect(() => {
        setLocalChoices([...q.choices]);
    }, [q.choices]);

    // Handlers for Blur (Commit changes)
    const handleTextBlur = () => {
        if (localText !== q.text) {
            onUpdate(q.id!, { text: localText });
        }
    };

    const handleChoiceBlur = (cIndex: number) => {
        if (localChoices[cIndex] !== q.choices[cIndex]) {
            const newChoices = [...q.choices];
            newChoices[cIndex] = localChoices[cIndex];
            onUpdate(q.id!, { choices: newChoices });
        }
    };

    const handleTimeBlur = () => {
        if (localTimeLimit !== q.timeLimit) {
            onUpdate(q.id!, { timeLimit: localTimeLimit });
        }
    };

    const handlePointsBlur = () => {
        if (localPoints !== q.points) {
            onUpdate(q.id!, { points: localPoints });
        }
    };

    // Handlers for Change (Local state only)
    const handleChoiceChange = (cIndex: number, val: string) => {
        const newChoices = [...localChoices];
        newChoices[cIndex] = val;
        setLocalChoices(newChoices);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative group"
        >
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-amber-900/20 rounded-full group-hover:bg-amber-500/50 transition-colors" />

            <Card className="fantasy-card border-none bg-black/40">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-lg bg-amber-950 border border-amber-500 flex items-center justify-center font-black text-amber-500 shadow-[0_0_10px_rgba(251,191,36,0.2)]">
                            {idx + 1}
                        </span>
                        <CardTitle className="text-xl font-bold tracking-widest text-amber-100 uppercase">第 {idx + 1} 問</CardTitle>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(q.id!)}
                        className="text-red-400 hover:bg-red-900/20 hover:text-red-300"
                    >
                        <Trash2 className="h-5 w-5" />
                    </Button>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-2">
                        <Label className="rpg-label">問題文</Label>
                        <Textarea
                            value={localText}
                            onChange={(e) => setLocalText(e.target.value)}
                            onBlur={handleTextBlur}
                            placeholder="例：日本の首都はどこ？"
                            className="min-h-[100px] bg-black/40 border-amber-900/50 text-white text-lg focus:border-amber-500 transition-colors resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <Label className="rpg-label">選択肢 (正しいものにチェック)</Label>
                            <RadioGroup
                                value={q.correctAnswer.toString()}
                                onValueChange={(val) => onUpdate(q.id!, { correctAnswer: parseInt(val) })}
                                className="space-y-3"
                            >
                                {localChoices.map((choice, cIdx) => (
                                    <div key={cIdx} className="flex items-center gap-3 group/choice">
                                        <RadioGroupItem
                                            value={cIdx.toString()}
                                            id={`q${idx}-c${cIdx}`}
                                            className="border-amber-500 text-amber-500"
                                        />
                                        <Input
                                            value={choice}
                                            onChange={(e) => handleChoiceChange(cIdx, e.target.value)}
                                            onBlur={() => handleChoiceBlur(cIdx)}
                                            placeholder={`選択肢 ${cIdx + 1}`}
                                            className="bg-black/20 border-white/10 group-focus-within/choice:border-amber-500 transition-colors"
                                        />
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="rpg-label flex items-center gap-2">
                                        <Clock className="h-3 w-3" /> 制限時間 (秒)
                                    </Label>
                                    <Input
                                        type="number"
                                        value={localTimeLimit}
                                        onChange={(e) => setLocalTimeLimit(parseInt(e.target.value) || 0)}
                                        onBlur={handleTimeBlur}
                                        className="bg-black/20 border-white/10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="rpg-label flex items-center gap-2">
                                        <Trophy className="h-3 w-3" /> 基本配点
                                    </Label>
                                    <Input
                                        type="number"
                                        value={localPoints}
                                        onChange={(e) => setLocalPoints(parseInt(e.target.value) || 0)}
                                        onBlur={handlePointsBlur}
                                        className="bg-black/20 border-white/10"
                                    />
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-amber-900/10 border border-amber-500/20 space-y-3">
                                <p className="rpg-label !mb-0 text-[10px] text-red-400">注意</p>
                                <p className="text-xs text-amber-200/70 leading-relaxed font-bold">
                                    正解のラジオボタンにチェックを入れてください。チェックがないと、誰も正解できなくなります。
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
});
QuestionItem.displayName = "QuestionItem";

export default function QuizEditor() {
    const { roomId } = useParams() as { roomId: string };
    const { user, loading: authLoading } = useAuth();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        if (authLoading || !user) return;

        const questionsRef = query(collection(db, "rooms", roomId, "questions"), orderBy("createdAt", "asc"));
        const unsubscribe = onSnapshot(questionsRef, (snapshot) => {
            setQuestions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Question)));
            setLoading(false);
        });

        return () => unsubscribe();
    }, [roomId, user, authLoading]);

    const handleAddQuestion = async () => {
        const newQuestion: Omit<Question, 'id'> = {
            text: "",
            choices: ["", "", "", ""],
            correctAnswer: 0,
            timeLimit: 20,
            points: 1000,
            createdAt: Date.now()
        } as any;

        await addDoc(collection(db, "rooms", roomId, "questions"), newQuestion);
    };

    const handleDeleteQuestion = async (id: string) => {
        await deleteDoc(doc(db, "rooms", roomId, "questions", id));
    };

    const handleUpdateQuestion = async (id: string, updates: Partial<Question>) => {
        await updateDoc(doc(db, "rooms", roomId, "questions", id), updates);
    };

    const handleSaveAll = () => {
        toast({
            title: "試練の書を更新しました",
            description: "すべての変更が魔導書に刻まれました。",
        });
        router.push(`/host/${roomId}`);
    };

    if (loading) return null;

    return (
        <div className="min-h-screen relative bg-slate-950 text-white p-4 md:p-8 pb-32">
            <div className="absolute inset-0 bg-[url('/fantasy-bg.png')] bg-cover bg-center mix-blend-overlay opacity-20 pointer-events-none" />

            <div className="max-w-4xl mx-auto space-y-10 relative z-10">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-amber-900/30">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => router.push(`/host/${roomId}`)} className="text-amber-400 hover:bg-amber-900/20">
                            <ArrowLeft className="h-6 w-6" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-black gold-text italic flex items-center gap-3">
                                <Scroll className="h-8 w-8 text-amber-500" />
                                クイズの内容を編集
                            </h1>
                            <p className="text-amber-200/70 text-sm">参加者に出題するクイズを作成してください。</p>
                        </div>
                    </div>
                    <Button onClick={handleSaveAll} className="fantasy-button px-8 h-14 text-lg text-amber-100">
                        <Save className="mr-2 h-5 w-5" /> 保存して戻る
                    </Button>
                </header>

                <div className="space-y-12">
                    <AnimatePresence>
                        {questions.map((q, qIdx) => (
                            <QuestionItem
                                key={q.id}
                                q={q}
                                idx={qIdx}
                                onUpdate={handleUpdateQuestion}
                                onDelete={handleDeleteQuestion}
                            />
                        ))}
                    </AnimatePresence>

                    <Button
                        onClick={handleAddQuestion}
                        variant="outline"
                        className="w-full h-24 border-dashed border-amber-900/50 hover:bg-amber-900/10 hover:border-amber-500 transition-all group rounded-3xl"
                    >
                        <div className="flex flex-col items-center gap-2 text-amber-200/70 group-hover:text-amber-400">
                            <Plus className="h-8 w-8" />
                            <span className="font-black text-sm uppercase tracking-[0.2em]">あらたな問題を追加</span>
                        </div>
                    </Button>
                </div>
            </div>

            {/* Bottom Floating Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-slate-950/80 backdrop-blur-md border-t border-amber-900/30 z-20">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <p className="text-amber-200/40 text-xs font-bold uppercase tracking-widest">
                        合計 {questions.length} 問
                    </p>
                    <div className="flex gap-4">
                        <Button onClick={handleSaveAll} className="fantasy-button px-10 text-amber-100">
                            保存して戻る
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
