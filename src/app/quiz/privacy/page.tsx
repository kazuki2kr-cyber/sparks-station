"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Home, ShieldCheck } from "lucide-react";

export default function PrivacyPolicy() {
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
                    <ShieldCheck className="h-16 w-16 text-amber-500 mx-auto" />
                    <h1 className="text-4xl font-black gold-text italic tracking-wider">プライバシーポリシー</h1>
                </header>

                <section className="space-y-8 bg-black/40 backdrop-blur-md p-8 rounded-3xl border border-white/5 leading-relaxed">
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-amber-400 border-l-4 border-amber-500 pl-4">1. 広告の配信について</h2>
                        <p>
                            当サイトでは、第三者配信の広告サービス「Google アドセンス」を利用しています。
                            広告配信事業者は、ユーザーの興味に応じた広告を表示するためにCookie（クッキー）を使用することがあります。
                        </p>
                        <p>
                            Cookieを無効にする設定およびGoogleアドセンスに関する詳細は「
                            <a
                                href="https://policies.google.com/technologies/ads"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-amber-500 hover:underline"
                            >
                                広告 – ポリシーと規約 – Google
                            </a>
                            」をご覧ください。
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-amber-400 border-l-4 border-amber-500 pl-4">2. アクセス解析ツールについて</h2>
                        <p>
                            当サイトでは、アクセス解析を目的として、Cookieを使用したデータの収集を行っている場合があります。
                            このデータは匿名で収集されており、個人を特定するものではありません。
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-amber-400 border-l-4 border-amber-500 pl-4">3. 免責事項</h2>
                        <p>
                            当サイトからリンクやバナーなどによって他のサイトに移動された場合、移動先サイトで提供される情報、サービス等について一切の責任を負いません。
                        </p>
                        <p>
                            当サイトのコンテンツ・情報につきまして、可能な限り正確な情報を掲載するよう努めておりますが、誤情報が入り込んだり、情報が古くなっていることもございます。
                            当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。
                        </p>
                    </div>

                    <div className="space-y-4 text-sm text-slate-400 pt-8 border-t border-white/5">
                        <p>策定日：2026年1月15日</p>
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
