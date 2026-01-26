import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/Footer";
import Script from "next/script";

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Fantasy Quizzes Kingdom | リアルタイムクイズバトル",
    description: "忘年会、結婚式、歓迎会などの余興で盛り上がる！インストール不要の無料早押しクイズゲーム。F1やマインクラフト、雑学、時事問題など多彩なジャンルで、幹事さんも安心のクイズ大会ツール。",
    keywords: [
        "クイズ", "早押し", "無料", "アプリ", "忘年会", "結婚式", "余興", "歓迎会", "パーティ", "幹事",
        "雑学", "F1", "Formula 1", "マインクラフト", "Minecraft", "マイクラ", "クイズ大会", "時事問題",
        "競馬", "Horse Racing", "JRA", "G1"
    ],
    openGraph: {
        title: "Fantasy Quizzes Kingdom | リアルタイムクイズバトル",
        description: "知識と速さで運命を切り拓け。忘年会や結婚式の余興に最適な、最大同時対戦可能なRPG風クイズゲーム。",
        images: ["/key-visual.png"],
    },
    alternates: {
        canonical: '/FantasyQuizzesKingdom',
    },
};

export default function QuizLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Script
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3577742758028719"
                crossOrigin="anonymous"
                strategy="lazyOnload"
            />
            <AuthProvider>
                <div className="flex-grow">
                    {children}
                </div>
                <Footer />
                <Toaster />
            </AuthProvider>
        </>
    );
}
