import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_JP } from "next/font/google"; // Import Noto_Sans_JP
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Configure Noto Sans JP
const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sparks-station.com"),


  title: {
    default: "Sparks Station | 最新の「開発事例」と先進的な「思想」を「プロダクト」へ。",
    template: "%s | Sparks Station",
  },
  description: "最新の「開発事例」と先進的な「思想」を「プロダクト」へ。海の向こうの開発事例と、世界をアップデートする概念。2つの知見を種火（Sparks）に変えて、プロダクトを創り出す。",
  keywords: ["Micro-SaaS", "個人開発", "エンジニア", "副業", "スタートアップ", "SaaS"],
  openGraph: {
    title: "Sparks Station",
    description: "最新の「開発事例」と先進的な「思想」を「プロダクト」へ。海の向こうの開発事例と、世界をアップデートする概念。2つの知見を種火（Sparks）に変えて、プロダクトを創り出す。",
    url: "https://sparks-station.com",
    siteName: "Sparks Station",
    locale: "ja_JP",
    type: "website",
    images: ["/sparks-station-kv.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sparks Station",
    description: "最新の「開発事例」と先進的な「思想」を「プロダクト」へ。海の向こうの開発事例と、世界をアップデートする概念。2つの知見を種火（Sparks）に変えて、プロダクトを創り出す。",
    images: ["/sparks-station-kv.png"],
  },
  other: {
    "google-adsense-account": "ca-pub-3577742758028719",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Sparks Station",
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
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansJP.variable} antialiased flex flex-col min-h-screen font-sans`}
      >
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3577742758028719"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <GoogleAnalytics gaId="G-4V4BG1669S" />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
