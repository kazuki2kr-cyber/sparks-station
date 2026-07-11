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
    default: "Sparks Station | AIアップデートと海外SaaS事例を、日本で試せる形へ。",
    template: "%s | Sparks Station",
  },
  description: "AIの最新アップデートと海外Micro-SaaS・AI SaaS事例を日本語で解説。活用方法、価格、GTM、日本で試せるプロダクト仮説まで整理します。",
  keywords: ["AIアップデート", "生成AI", "Micro-SaaS", "AI SaaS", "個人開発", "SaaS事例", "GTM"],
  openGraph: {
    title: "Sparks Station",
    description: "AIの最新アップデートと海外SaaS事例を、日本で試せる活用方法とプロダクト仮説まで整理します。",
    url: "https://sparks-station.com",
    siteName: "Sparks Station",
    locale: "ja_JP",
    type: "website",
    images: ["/sparks-station-kv.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sparks Station",
    description: "AIの最新アップデートと海外SaaS事例を、日本で試せる活用方法とプロダクト仮説まで整理します。",
    images: ["/sparks-station-kv.png"],
  },
  other: {
    "google-adsense-account": "ca-pub-3577742758028719",
    "google-site-verification": "dVgTYxnAWJx8eAoxaxU8D9y7c40_RJP1RuDTJ2aPXRI",
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
