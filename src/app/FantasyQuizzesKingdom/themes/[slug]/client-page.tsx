"use client";

import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { QUIZ_CATEGORIES } from "../../lib/constants";
import { Sparkles, Sword, PartyPopper, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import { generateRoomId } from "@/lib/utils-game";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

export default function ThemeLandingPage({ slug, categoryId }: { slug: string, categoryId: string }) {
    const { user, loginAnonymously } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const category = QUIZ_CATEGORIES.find(c => c.id === categoryId);

    const handleStartTheme = async () => {
        setIsLoading(true);
        try {
            if (!user) {
                await loginAnonymously();
            }

            // Re-check auth
            const { auth } = require("@/lib/firebase");
            const currentUser = auth.currentUser;
            if (!currentUser) throw new Error("Authentication failed");

            // Create Room directly with this category
            let newId = generateRoomId();
            let docRef = doc(db, "rooms", newId);
            let docSnap = await getDoc(docRef);

            while (docSnap.exists()) {
                newId = generateRoomId();
                docRef = doc(db, "rooms", newId);
                docSnap = await getDoc(docRef);
            }

            await setDoc(doc(db, "rooms", newId), {
                status: "waiting",
                currentQuestionIndex: -1,
                currentPhase: "waiting",
                hostId: currentUser.uid,
                hostName: "管理者",
                createdAt: Date.now(),
                type: 'standard', // Force standard mode for quick start
                category: categoryId,
                categoryName: category?.name || "一般常識",
                hostParticipates: false,
                shortId: newId
            });

            router.push(`/FantasyQuizzesKingdom/host/${newId}`);

        } catch (e: any) {
            console.error(e);
            toast({
                title: "エラーが発生しました",
                description: "ルーム作成に失敗しました。",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-x-hidden bg-slate-950 text-white">
            <div className="absolute inset-0 bg-[url('/fantasy-bg.png')] bg-cover bg-center mix-blend-overlay opacity-30 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

            <div className="relative z-10 w-full max-w-4xl mx-auto space-y-16 py-20">
                {/* Hero Section */}
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 font-bold uppercase tracking-widest text-xs mb-4">
                        <PartyPopper className="h-4 w-4" /> Feature: {category?.name || "Special Theme"}
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter gold-text leading-tight">
                        {categoryId === 'party' ? (
                            <>
                                忘年会・パーティを<br />
                                <span className="text-white">最強に盛り上げる</span><br />
                                魔法のクイズツール
                            </>
                        ) : categoryId === 'study' ? (
                            <>
                                授業・レクリエーションが<br />
                                <span className="text-white">一瞬で熱狂に変わる</span>
                            </>
                        ) : (
                            <>{category?.name} クイズ大会</>
                        )}
                    </h1>

                    <p className="text-lg md:text-xl text-amber-100/70 max-w-2xl mx-auto leading-relaxed font-bold">
                        {categoryId === 'party'
                            ? "「準備する時間がない...」「機材がない...」そんな幹事様の悩みを解決。スマホさえあれば、誰でもすぐに本格的な早押しクイズ大会を開催できます。"
                            : "インストール不要、ログイン不要。URLを共有するだけで、全員参加型のクイズバトルが始まります。"
                        }
                    </p>

                    <div className="pt-8">
                        <Button
                            onClick={handleStartTheme}
                            disabled={isLoading}
                            className="h-20 px-12 text-2xl font-black fantasy-button border-2 border-amber-400 text-amber-950 hover:scale-105 transition-transform shadow-[0_0_40px_rgba(251,191,36,0.3)]"
                        >
                            {isLoading ? "魔力を充填中..." : "今すぐクイズを始める（無料）"} <ArrowRight className="ml-2 h-6 w-6" />
                        </Button>
                        <p className="text-xs text-white/40 mt-4">※ 面倒な会員登録やアプリインストールは一切不要です</p>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card className="fantasy-card bg-black/50 border-white/10 backdrop-blur-sm">
                        <CardContent className="p-8 text-center space-y-4">
                            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-xl">
                                <Users className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-black gold-text">全員参加で盛り上がる</h3>
                            <p className="text-sm text-gray-400 font-medium leading-relaxed">
                                最大50人まで同時対戦可能。見てるだけの人がいない、全員主役のパーティを実現します。
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="fantasy-card bg-black/50 border-white/10 backdrop-blur-sm">
                        <CardContent className="p-8 text-center space-y-4">
                            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-xl">
                                <Sparkles className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-black gold-text">インストール不要</h3>
                            <p className="text-sm text-gray-400 font-medium leading-relaxed">
                                参加者はQRコードを読み込むだけ。アプリのダウンロードも、面倒なID登録も必要ありません。
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="fantasy-card bg-black/50 border-white/10 backdrop-blur-sm">
                        <CardContent className="p-8 text-center space-y-4">
                            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-xl">
                                <Sword className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-black gold-text">{category?.name || "厳選"}問題を搭載</h3>
                            <p className="text-sm text-gray-400 font-medium leading-relaxed">
                                「{category?.name || "パーティ"}」向けの厳選クイズセットをプリセット。問題作成の手間ゼロで開始できます。
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Steps */}
                <div className="space-y-8">
                    <h2 className="text-3xl font-black text-center gold-text italic">3ステップで開始</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <div className="text-4xl font-black text-amber-500/20 mb-2">01</div>
                            <h3 className="font-bold text-amber-100 mb-2">「今すぐ始める」をクリック</h3>
                            <p className="text-xs text-white/50">あなたのためのクイズルームが即座に作成されます。</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <div className="text-4xl font-black text-amber-500/20 mb-2">02</div>
                            <h3 className="font-bold text-amber-100 mb-2">URLをみんなに共有</h3>
                            <p className="text-xs text-white/50">LINEやSlackで共有するか、QRコードを見せましょう。</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <div className="text-4xl font-black text-amber-500/20 mb-2">03</div>
                            <h3 className="font-bold text-amber-100 mb-2">ゲームスタート！</h3>
                            <p className="text-xs text-white/50">全員が集まったら、あなたの合図でバトル開始です。</p>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    )
}
