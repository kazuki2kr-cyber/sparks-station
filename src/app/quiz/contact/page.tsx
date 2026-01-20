"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Home, Mail, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !message) {
            toast({
                title: "入力エラー",
                description: "すべての項目を入力してください。",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        try {
            await addDoc(collection(db, "contacts"), {
                name,
                email,
                message,
                createdAt: serverTimestamp(),
            });
            setIsSuccess(true);
            toast({
                title: "送信完了",
                description: "お問い合わせを受け付けました。ありがとうございます。",
            });
        } catch (error: any) {
            console.error("Error submitting contact form:", error);
            toast({
                title: "送信失敗",
                description: "エラーが発生しました。時間をおいて再度お試しください。",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen relative bg-slate-950 text-slate-200 p-6 py-20 flex flex-col items-center justify-center">
            <div className="absolute inset-0 bg-[url('/fantasy-bg.png')] bg-cover bg-center mix-blend-overlay opacity-10 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-xl w-full relative z-10"
            >
                <Card className="fantasy-card border-none bg-black/40 backdrop-blur-xl p-2 sm:p-6">
                    <CardHeader className="text-center space-y-4">
                        <div className="mx-auto w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center border border-amber-500/30">
                            <Mail className="h-8 w-8 text-amber-500" />
                        </div>
                        <CardTitle className="text-3xl font-black gold-text italic tracking-wider">お問い合わせ</CardTitle>
                        <CardDescription className="text-amber-200/50">
                            ご意見、不具合報告、お仕事の依頼などはこちらからお送りください。
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <AnimatePresence mode="wait">
                            {!isSuccess ? (
                                <motion.form
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-amber-500/70 uppercase tracking-widest ml-1">お名前</label>
                                        <Input
                                            placeholder="勇者 または 賢者"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="bg-black/40 border-amber-900/50 text-white h-12 focus:border-amber-500"
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-amber-500/70 uppercase tracking-widest ml-1">メールアドレス</label>
                                        <Input
                                            type="email"
                                            placeholder="example@mail.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="bg-black/40 border-amber-900/50 text-white h-12 focus:border-amber-500"
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-amber-500/70 uppercase tracking-widest ml-1">メッセージ内容</label>
                                        <Textarea
                                            placeholder="メッセージを入力してください..."
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            className="bg-black/40 border-amber-900/50 text-white min-h-[150px] focus:border-amber-500"
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full h-14 text-lg font-black fantasy-button group text-amber-100"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        ) : (
                                            <>
                                                送信する <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            </>
                                        )}
                                    </Button>
                                </motion.form>
                            ) : (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center py-12 space-y-6"
                                >
                                    <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-bold text-white">送信が完了しました</h3>
                                        <p className="text-slate-400">
                                            お問い合わせありがとうございます。内容を確認次第、必要に応じてご連絡させていただきます。
                                        </p>
                                    </div>
                                    <Button
                                        onClick={() => router.push("/")}
                                        variant="outline"
                                        className="border-amber-500/50 text-amber-500 hover:bg-amber-500/10"
                                    >
                                        ホームへ戻る
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardContent>
                </Card>

                <div className="mt-8 flex justify-center">
                    <Button
                        variant="ghost"
                        onClick={() => router.push("/")}
                        className="text-slate-500 hover:text-amber-500"
                    >
                        <Home className="mr-2 h-4 w-4" /> ホームに戻る
                    </Button>
                </div>
            </motion.div>
        </main>
    );
}
