"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { generateRoomId } from "@/lib/utils-game";
import { Plus, Sparkles, Sword } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import AdBanner from "@/components/AdBanner";

export default function Home() {
  const { user, loginAnonymously } = useAuth();
  const [roomId, setRoomId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

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
    <main className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-x-hidden">
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

          <CardContent className="space-y-6 pt-6">
            <div className="space-y-4">
              <Button
                onClick={handleCreateRoom}
                disabled={isLoading}
                className="w-full fantasy-button py-7 text-lg group relative overflow-hidden text-amber-100 font-bold"
              >
                <span className="relative z-10 flex items-center">
                  <Plus className="mr-2 h-5 w-5 transition-transform group-hover:rotate-90" />
                  クイズを作成する
                </span>
              </Button>

              <div className="relative py-4">
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-white/10" />
                <span className="relative bg-[#1a120b] px-3 text-xs text-white/30 uppercase tracking-[0.3em] font-bold block mx-auto w-fit">
                  または
                </span>
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
              <p className="text-center text-amber-200/30 text-xs">
                コードを入力してクイズに参加
              </p>
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
              <Sword className="h-6 w-6 text-amber-500" />
              遊び方
            </h2>
            <ul className="space-y-4 text-amber-100/80 font-medium leading-relaxed">
              <li className="flex gap-3">
                <span className="text-amber-500 font-bold">01.</span>
                <span>「クイズを作成する」ボタンから、自分だけの対戦ルームを立ち上げます。</span>
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
                <p className="text-amber-100/60 text-sm">オンライン高速同期により、仲間と同じ瞬間にクイズに挑めます。</p>
              </div>
              <div>
                <h3 className="text-amber-400 font-bold mb-1">スピードボーナス</h3>
                <p className="text-amber-100/60 text-sm">ただ正解するだけでなく、0.1秒の差が勝敗を分ける。戦略的な早押しが求められます。</p>
              </div>
              <div>
                <h3 className="text-amber-400 font-bold mb-1">ファンタジーな世界観</h3>
                <p className="text-amber-100/60 text-sm">魔法と知略の王国をイメージしたUIで、没入感のあるクイズ体験を提供します。</p>
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
    </main>
  );
}
