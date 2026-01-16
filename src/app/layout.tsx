import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "@/components/ui/toaster";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fantasy Quizzes Kingdom",
  description: "リアルタイムで競い合う、魔法と知略の早押しクイズ。仲間と共に究極の賢者を目指せ。",
  keywords: ["クイズ", "早押し", "ファンタジー", "対戦", "マルチプレイヤー", "スコアアタック"],
  openGraph: {
    title: "Fantasy Quizzes Kingdom",
    description: "魔法と知略の早押しクイズ。リアルタイム対戦で覇を競え。",
    url: "https://hayaoshi-quiz.vercel.app", // 本番URLが確定していれば差し替えてください
    siteName: "Fantasy Quizzes Kingdom",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fantasy Quizzes Kingdom",
    description: "魔法と知略の早押しクイズ。リアルタイム対戦で覇を競え。",
  },
  other: {
    "google-adsense-account": "ca-pub-3577742758028719",
  },
};

import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3577742758028719"
          crossOrigin="anonymous"
        />
        <AuthProvider>
          <div className="flex-grow">
            {children}
          </div>
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
