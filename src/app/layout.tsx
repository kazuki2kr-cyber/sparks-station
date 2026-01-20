import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sparks-station.com"),
  alternates: {
    canonical: "/",
  },
  title: "Fantasy Quizzes Kingdom",
  description: "リアルタイムで競い合う、魔法と知略の早押しクイズ。仲間と共に究極の賢者を目指せ。",
  keywords: ["クイズ", "早押し", "ファンタジー", "対戦", "マルチプレイヤー", "スコアアタック"],
  openGraph: {
    title: "Fantasy Quizzes Kingdom",
    description: "魔法と知略の早押しクイズ。リアルタイム対戦で覇を競え。",
    url: "https://sparks-station.com",
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
        {children}
      </body>
    </html>
  );
}
