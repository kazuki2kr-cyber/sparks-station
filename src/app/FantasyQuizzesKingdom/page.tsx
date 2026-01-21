"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { generateRoomId } from "@/lib/utils-game";
import { Sparkles, Sword, Crown, Users, ArrowLeft, Gamepad2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import AdBanner from "@/components/AdBanner";

type ViewMode = "TOP" | "MULTI";

export default function Home() {
  const { user, loginAnonymously } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>("TOP");
  const [roomId, setRoomId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleCreateRoom = async (mode: 'standard' | 'original' = 'original') => {
    setIsLoading(true);
    try {
      if (!user) {
        await loginAnonymously();
      }

      // Re-check auth (using imported auth to be sure)
      const { auth } = require("@/lib/firebase");
      let currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error("ログインに失敗しました。認証設定を確認してください。");
      }

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
        // Save mode here so room logic knows where to fetch questions from
        type: mode,
        shortId: newId
      });

      router.push(`/FantasyQuizzesKingdom/host/${newId}`);
    } catch (e: any) {
      console.error(e);
      toast({
        title: "エラーが発生しました",
        description: e.message || "クイズの作成に失敗しました。もう一度お試しください。",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (roomId.length !== 6) return;
    setIsLoading(true);
    try {
      if (!user) {
        await loginAnonymously();
      }
      router.push(`/FantasyQuizzesKingdom/room/${roomId}`);
    } catch (e: any) {
      console.error(e);
      toast({
        title: "エラーが発生しました",
        description: e.message || "ルームへの参加に失敗しました。",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {showSplash ? (
        <motion.div
          key="splash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-full h-full"
          >
            <img
              src="/key-visual.png"
              alt="Fantasy Quizzes Kingdom"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-60" />
          </motion.div>
        </motion.div>
      ) : (
        <motion.main
          key="main"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-x-hidden"
        >
          {/* Fantasy Background */}
          <div
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/fantasy-bg.png')", filter: "brightness(0.4) contrast(1.2)" }}
          />
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />

          {/* Main Title Area (Always Visible in some form, but simplified in sub-modes if desired. 
              Here we keep it consistent as Top View header) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full max-w-lg z-10 mt-20 text-center"
          >
            <Card className="fantasy-card border-none bg-black/40 backdrop-blur-xl mb-8">
              <CardHeader className="text-center pb-2">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="inline-block mx-auto mb-4"
                >
                  <div className="relative">
                    <Sword className="h-12 w-12 text-amber-500 absolute -top-1 -left-1 rotate-[-15deg] opacity-50" />
                    <Sparkles className="h-16 w-16 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                  </div>
                </motion.div>
                <h1 className="text-4xl font-black italic tracking-tighter gold-text uppercase">
                  Fantasy Quizzes
                  <span className="block text-2xl mt-2 tracking-[0.5em]">Kingdom</span>
                </h1>
                <CardDescription className="text-amber-200/70 font-medium text-sm mt-4">
                  知識と速さで運命を切り拓け
                </CardDescription>
              </CardHeader>

              <CardContent>
                {/* TOP MODE SELECTION */}
                {viewMode === "TOP" && (
                  <div className="space-y-6 pt-4">
                    <div className="grid grid-cols-1 gap-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => router.push("/FantasyQuizzesKingdom/solo")}
                        className="relative p-6 rounded-2xl bg-gradient-to-r from-amber-600/20 to-amber-900/40 border border-amber-500/30 group overflow-hidden text-left"
                      >
                        <div className="flex items-center gap-4">
                          <Crown className="h-10 w-10 text-amber-400" />
                          <div>
                            <div className="text-amber-400 font-bold text-xs uppercase tracking-widest">Solo Mode</div>
                            <div className="text-xl font-black text-white">ひとりで遊ぶ</div>
                            <div className="text-amber-100/50 text-[10px]">スコアアタック・ランキング挑戦</div>
                          </div>
                        </div>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setViewMode("MULTI")}
                        className="relative p-6 rounded-2xl bg-gradient-to-r from-amber-600/20 to-amber-900/40 border border-amber-500/30 group overflow-hidden text-left"
                      >
                        <div className="flex items-center gap-4">
                          <Users className="h-10 w-10 text-amber-400" />
                          <div>
                            <div className="text-amber-400 font-bold text-xs uppercase tracking-widest">Multi Mode</div>
                            <div className="text-xl font-black text-white">みんなで遊ぶ</div>
                            <div className="text-amber-100/50 text-[10px]">リアルタイム対戦・ルーム作成</div>
                          </div>
                        </div>
                      </motion.button>
                    </div>
                  </div>
                )}

                {/* MULTI MODE CONTENT */}
                {viewMode === "MULTI" && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-4">
                    <div className="space-y-4">
                      <div className="text-center">
                        <h3 className="text-amber-400 font-bold text-sm uppercase tracking-widest mb-4">ルーム作成 (Create Room)</h3>
                        <div className="grid grid-cols-1 gap-3">
                          <Button
                            onClick={() => handleCreateRoom('original')}
                            className="w-full h-14 bg-amber-900/50 hover:bg-amber-800/50 border border-amber-500/30 text-amber-100 font-bold"
                          >
                            <Sparkles className="mr-2 h-4 w-4 text-amber-400" />
                            オリジナル問題で遊ぶ
                          </Button>
                          <Button
                            onClick={() => handleCreateRoom('standard')}
                            className="w-full h-14 bg-amber-900/50 hover:bg-amber-800/50 border border-amber-500/30 text-amber-100 font-bold opacity-80"
                          >
                            <Gamepad2 className="mr-2 h-4 w-4 text-amber-400" />
                            既存問題で遊ぶ (Coming Soon)
                          </Button>
                        </div>
                      </div>

                      <div className="relative py-2">
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-white/10" />
                        <span className="relative bg-[#0d0905] px-3 text-[10px] text-white/30 uppercase tracking-[0.4em] font-black block mx-auto w-fit">
                          OR
                        </span>
                      </div>

                      <div className="text-center">
                        <h3 className="text-amber-400 font-bold text-sm uppercase tracking-widest mb-4">ルームに参加 (JOIN ROOM)</h3>
                        <div className="flex gap-2">
                          <Input
                            placeholder="6桁のコード"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            maxLength={6}
                            className="h-14 bg-black/40 border-amber-900/50 text-white placeholder:text-white/20 text-center text-xl font-mono tracking-widest focus:border-amber-500 focus:ring-amber-500"
                          />
                          <Button
                            onClick={handleJoinRoom}
                            disabled={roomId.length !== 6 || isLoading}
                            className="h-14 px-6 bg-amber-600 hover:bg-amber-500 text-black font-black disabled:opacity-50 disabled:bg-slate-800 shrink-0"
                          >
                            参加
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center pt-2">
                      <Button
                        variant="ghost"
                        onClick={() => setViewMode("TOP")}
                        className="text-white/30 hover:text-amber-500"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" /> ホームに戻る
                      </Button>
                    </div>
                  </div>
                )}

              </CardContent>
            </Card>
          </motion.div>


          {/* Information Cards Section - Conditional Rendering */}
          <div className="w-full max-w-4xl z-10 space-y-12 mb-20 animate-in fade-in duration-1000">

            {/* TOP VIEW INFO */}
            {viewMode === "TOP" && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center p-8 md:p-12 bg-gradient-to-r from-amber-900/20 via-black/40 to-amber-900/20 rounded-3xl border border-white/5"
              >
                <h2 className="text-2xl md:text-3xl font-black gold-text italic mb-6">究極のクイズ体験を</h2>
                <p className="max-w-2xl mx-auto text-amber-100/70 leading-loose text-sm md:text-base">
                  Fantasy Quizzes Kingdomは、単なるクイズアプリではありません。
                  友人たちと知恵を競い、一瞬の判断力を磨く、まさに知略の戦場です。
                  インストール不要で、今すぐブラウザから開始できます。
                </p>
              </motion.section>
            )}

            {/* MULTI VIEW INFO */}
            {viewMode === "MULTI" && (
              <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="fantasy-card bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-white/5 space-y-4"
                >
                  <h2 className="text-2xl font-black gold-text italic flex items-center gap-3">
                    <Sword className="h-6 w-6 text-amber-500" />
                    リアルタイム対戦モードの遊び方
                  </h2>
                  <ul className="space-y-4 text-amber-100/80 font-medium leading-relaxed">
                    <li className="flex gap-3"><span className="text-amber-500 font-bold">01.</span><span>ルームを作成し、IDを仲間に共有。</span></li>
                    <li className="flex gap-3"><span className="text-amber-500 font-bold">02.</span><span>全員が集まったらゲーム開始！</span></li>
                    <li className="flex gap-3"><span className="text-amber-500 font-bold">03.</span><span>回答速度に応じてボーナススコア。</span></li>
                    <li className="flex gap-3"><span className="text-amber-500 font-bold">04.</span><span>「既存問題」を選べばクイズ作成不要。</span></li>
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="fantasy-card bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-white/5 space-y-4"
                >
                  <h2 className="text-2xl font-black gold-text italic flex items-center gap-3">
                    <Sparkles className="h-6 w-6 text-amber-500" />
                    特徴
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-amber-400 font-bold mb-1">リアルタイム同期</h3>
                      <p className="text-amber-100/60 text-sm">白熱した早押しバトルを遅延なく実現。</p>
                    </div>
                    <div>
                      <h3 className="text-amber-400 font-bold mb-1">2つの出題モード</h3>
                      <p className="text-amber-100/60 text-sm">自分で作ったクイズで遊ぶことも、用意された難問に挑むことも可能。</p>
                    </div>
                  </div>
                </motion.div>
              </section>
            )}

            <div className="px-6 space-y-4">
              <AdBanner adSlot="home_bottom" />
            </div>

          </div>
        </motion.main>
      )}
    </AnimatePresence>
  );
}
