"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Home, FileText } from "lucide-react";

export default function TermsOfService() {
    const router = useRouter();

    return (
        <main className="min-h-screen relative bg-slate-950 text-slate-200 p-6 py-20 flex flex-col items-center">
            <div className="absolute inset-0 bg-[url('/fantasy-bg.png')] bg-cover bg-center mix-blend-overlay opacity-10 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl w-full space-y-12 relative z-10"
            >
                <header className="text-center space-y-4">
                    <FileText className="h-16 w-16 text-amber-500 mx-auto" />
                    <h1 className="text-4xl font-black gold-text italic tracking-wider">利用規約</h1>
                </header>

                <section className="space-y-8 bg-black/40 backdrop-blur-md p-8 rounded-3xl border border-white/5 leading-relaxed">
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-amber-400 border-l-4 border-amber-500 pl-4">1. 利用規約への同意</h2>
                        <p>
                            「Fantasy Quizzes Kingdom」（以下「当サービス」）をご利用いただくことで、本規約に同意したものとみなされます。
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-amber-400 border-l-4 border-amber-500 pl-4">2. 禁止事項</h2>
                        <p>利用者は、当サービスの利用にあたり、以下の行為を行ってはならないものとします。</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>公序良俗に反する行為、またはその恐れのある行為</li>
                            <li>当サービスのシステムに対する不正アクセスや妨害行為</li>
                            <li>他の利用者の迷惑となる行為</li>
                            <li>その他、当運営が不適切と判断する行為</li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-amber-400 border-l-4 border-amber-500 pl-4">3. サービスの中断・変更</h2>
                        <p>
                            当サービスは、事前の通知なしに内容の変更、一時停止、または終了することがあります。
                            これにより利用者に生じた損害について、当運営は一切の責任を負いません。
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-amber-400 border-l-4 border-amber-500 pl-4">4. 準拠法</h2>
                        <p>
                            本規約の解釈および適用にあたっては、日本法を準拠法とします。
                        </p>
                    </div>

                    <div className="space-y-4 text-sm text-slate-400 pt-8 border-t border-white/5">
                        <p>最終更新日：2026年1月15日</p>
                        <p>運営：sparks-station.com</p>
                    </div>
                </section>

                <div className="flex justify-center">
                    <Button
                        onClick={() => router.push("/")}
                        className="fantasy-button px-10 h-14"
                    >
                        <Home className="mr-2 h-5 w-5" /> ホームに戻る
                    </Button>
                </div>
            </motion.div>
        </main>
    );
}
