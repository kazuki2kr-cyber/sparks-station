"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { generateRoomId } from "@/lib/utils-game";
import { Plus, Sparkles, Sword, Crown, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import AdBanner from "@/components/AdBanner";

export default function Home() {
  const { user, loginAnonymously } = useAuth();
  const [roomId, setRoomId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500); // 2.5 seconds total for splash
    return () => clearTimeout(timer);
  }, []);

  const handleCreateRoom = async () => {
    setIsLoading(true);
    try {
      if (!user) {
        await loginAnonymously();
        // Wait a bit for user state to update? 
        // Actually loginAnonymously in context updates state. 
        // But we might need to handle the case where user is not yet set in this render cycle if we don't await properly or if context updates asynchronously.
        // However, firebase auth is async. Let's assume after await, `auth.currentUser` is available even if context `user` isn't immediately.
        // Better: use auth.currentUser directly or rely on the fact that we'll be redirected if we push.
        // But we need uid for creation.
      }

      // We can't easily get the user object *immediately* from context after login if it uses a listener.
      // It's safer to let the user click again or handle the "loading" state until user is present.
      // But for better UX, let's just wait a slight bit or check auth.currentUser.
      // Given the constraints, let's just trigger login if !user and assume consistency for next click or chained.
      // Actually, if I await loginAnonymously, the context state might update.
      // Let's rely on the auth instance directly for the ID if needed, but context is better.
      // For simplicity: If !user, login, return (UI will update). User clicks again? No that's bad.
      // Let's assume loginAnonymously waits for listener? NO, it just waits for signIn. 
      // The listener fires separately.
      // Proper way: wrapper that handles "Login & Action".

      let currentUser = user;
      if (!currentUser) {
        await loginAnonymously();
        // We can't get the user object here easily without direct auth import or return from login function.
        // Let's modify logic to just require user to be logged in effectively.
        // But I'll try to fetch it from the auth instance if needed.
        // For now, let's keep it simple: If not logged in, log in. 
        // Then in a useEffect or similar, if we were "trying to create", proceed.
        // OR: Just grab `auth.currentUser` from firebase import.
      }

      // Re-check auth (using imported auth to be sure)
      const { auth } = require("@/lib/firebase");
      currentUser = auth.currentUser;

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
        hostName: "管理者", // Anonymous users don't have display names usually
        createdAt: Date.now(),
        shortId: newId
      });

      router.push(`/host/${newId}`);
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
      router.push(`/room/${roomId}`);
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
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
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
          transition={{ duration: 0.8 }}
          className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-x-hidden"
        >
          {/* Fantasy Background */}
          <div
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/fantasy-bg.png')", filter: "brightness(0.4) contrast(1.2)" }}
          />
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full max-w-md z-10 mt-20"
          >
            <Card className="fantasy-card border-none bg-black/40 backdrop-blur-xl">
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
                <CardTitle className="text-4xl font-black italic tracking-tighter gold-text uppercase">
                  Fantasy Quizzes
                  <span className="block text-2xl mt-2 tracking-[0.5em]">Kingdom</span>
                </CardTitle>
                <CardDescription className="text-amber-200/70 font-medium text-sm mt-4">
                  知識と速さで運命を切り拓け
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-8 pt-6">
                {/* Solo Mode Card */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push("/solo")}
                  className="relative p-6 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-900/40 border border-amber-500/30 cursor-pointer group overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Crown className="h-20 w-20 text-white" />
                  </div>
                  <div className="relative z-10 flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-amber-400 font-black text-sm uppercase tracking-widest">
                      Solo Mode
                    </div>
                    <h3 className="text-xl font-black text-white">ひとりで遊ぶ</h3>
                    <p className="text-amber-100/60 text-[10px] font-bold">
                      スコアアタックモード
                    </p>
                    <p className="text-amber-100/30 text-[10px] mt-1">
                      10問のクイズに答え、全国ランキングに挑戦。
                    </p>
                  </div>
                </motion.div>

                <div className="relative py-2">
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-white/10" />
                  <span className="relative bg-[#1a120b] px-3 text-[10px] text-white/30 uppercase tracking-[0.4em] font-black block mx-auto w-fit">
                    OR
                  </span>
                </div>

                {/* Multiplayer Mode Card */}
                <div className="space-y-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreateRoom}
                    className="relative p-6 rounded-2xl bg-gradient-to-br from-amber-600/20 to-amber-900/60 border border-amber-600/30 cursor-pointer group overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Users className="h-20 w-20 text-white" />
                    </div>
                    <div className="relative z-10 flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-amber-500 font-black text-sm uppercase tracking-widest">
                        Multiplayer
                      </div>
                      <h3 className="text-xl font-black text-white">みんなで遊ぶ（ルームを作る）</h3>
                      <p className="text-amber-100/60 text-[10px] font-bold">
                        リアルタイム対戦モード
                      </p>
                      <p className="text-amber-100/30 text-[10px] mt-1">
                        最大20人で同時に競い合う早押しバトル。
                      </p>
                    </div>
                  </motion.div>

                  <div className="pt-2 px-1">
                    <p className="text-amber-400 font-black text-[10px] uppercase tracking-widest animate-pulse">
                      ルームに参加するにはコードを入力
                    </p>
                  </div>

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
                <div className="px-6 space-y-4">
                  <AdBanner adSlot="home_bottom" />
                </div>
              </CardContent>

              <CardFooter className="justify-center border-t border-white/5 pt-6 pb-4">
                <p className="text-white/20 text-[10px] uppercase tracking-[0.5em] font-black">
                  © 2026 sparks-station.com
                </p>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Added Content Sections for AdSense Compliance */}
          <div className="w-full max-w-4xl z-10 mt-20 space-y-12 mb-20">
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="fantasy-card bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-white/5 space-y-4"
              >
                <h2 className="text-2xl font-black gold-text italic flex items-center gap-3">
                  <Crown className="h-6 w-6 text-amber-500" />
                  スコアアタックモードの遊び方
                </h2>
                <ul className="space-y-4 text-amber-100/80 font-medium leading-relaxed">
                  <li className="flex gap-3">
                    <span className="text-amber-500 font-bold">01.</span>
                    <span>「ひとりで遊ぶ」を選択して、スコアアタックを開始します。</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-amber-500 font-bold">02.</span>
                    <span>厳選された一般常識問題が全10問出題されます。</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-amber-500 font-bold">03.</span>
                    <span>各問題の制限時間は10秒。早く答えれば高得点！</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-amber-500 font-bold">04.</span>
                    <span>最終スコアは全国ランキングに登録されます。トップ10を目指しましょう。</span>
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="fantasy-card bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-white/5 space-y-4"
              >
                <h2 className="text-2xl font-black gold-text italic flex items-center gap-3">
                  <Sword className="h-6 w-6 text-amber-500" />
                  リアルタイム対戦モードの遊び方
                </h2>
                <ul className="space-y-4 text-amber-100/80 font-medium leading-relaxed">
                  <li className="flex gap-3">
                    <span className="text-amber-500 font-bold">01.</span>
                    <span>「ルームを作る」ボタンから、自分だけの対戦ルームを立ち上げます。</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-amber-500 font-bold">02.</span>
                    <span>発行された6桁のルームIDを、一緒に遊びたい仲間に共有しましょう。</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-amber-500 font-bold">03.</span>
                    <span>全員が集まったらゲーム開始！画面に表示される問題に素早く答えてください。</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-amber-500 font-bold">04.</span>
                    <span>回答速度に応じてボーナススコアが加算されます。最速を目指せ！</span>
                  </li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="fantasy-card bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-white/5 space-y-4"
              >
                <h2 className="text-2xl font-black gold-text italic flex items-center gap-3">
                  <Sparkles className="h-6 w-6 text-amber-500" />
                  特徴
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-amber-400 font-bold mb-1">リアルタイム対戦</h3>
                    <p className="text-amber-100/60 text-sm">オンライン高速同期により、白熱した早押しクイズに挑めます。</p>
                  </div>
                  <div>
                    <h3 className="text-amber-400 font-bold mb-1">スピードボーナス</h3>
                    <p className="text-amber-100/60 text-sm">ただ正解するだけでなく、0.1秒の差が勝敗を分ける。戦略的な早押しが求められます。</p>
                  </div>
                  <div>
                    <h3 className="text-amber-400 font-bold mb-1">ファンタジーな世界観</h3>
                    <p className="text-amber-100/60 text-sm">ファンタジーな世界観をイメージしたUIで、没入感のあるクイズ体験を提供します。</p>
                  </div>
                </div>
              </motion.div>
            </section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center p-12 bg-gradient-to-r from-amber-900/20 via-black/40 to-amber-900/20 rounded-3xl border border-white/5"
            >
              <h2 className="text-3xl font-black gold-text italic mb-6">究極のクイズ体験を</h2>
              <p className="max-w-2xl mx-auto text-amber-100/70 leading-loose">
                Fantasy Quizzes Kingdomは、単なるクイズアプリではありません。
                友人たちと知恵を競い、一瞬の判断力を磨く、まさに知略の戦場です。
                インストール不要で、今すぐブラウザから開始できます。
              </p>
            </motion.section>
          </div>
        </motion.main>
      )}
    </AnimatePresence>
  );
}
