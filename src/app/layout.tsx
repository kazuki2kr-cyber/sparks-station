import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_JP } from "next/font/google"; // Import Noto_Sans_JP
import "./globals.css";


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
  alternates: {
    canonical: "/",
  },
  title: {
    default: "Sparks Station | Micro-SaaS Insights for Engineers",
    template: "%s | Sparks Station",
  },
  description: "海外の売却事例から「稼げるヒント」をエンジニアへ。Micro-SaaSの分析とExit事例を紹介するメディア。",
  keywords: ["Micro-SaaS", "個人開発", "エンジニア", "副業", "スタートアップ", "SaaS"],
  openGraph: {
    title: "Sparks Station",
    description: "海外の売却事例から「稼げるヒント」をエンジニアへ。",
    url: "https://sparks-station.com",
    siteName: "Sparks Station",
    locale: "ja_JP",
    type: "website",
    images: ["/sparks-station-kv.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sparks Station",
    description: "海外の売却事例から「稼げるヒント」をエンジニアへ。",
    images: ["/sparks-station-kv.png"],
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
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansJP.variable} antialiased flex flex-col min-h-screen font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
