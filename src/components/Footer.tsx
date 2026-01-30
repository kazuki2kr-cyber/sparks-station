"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
    return (
        <footer className="w-full py-12 px-6 border-t border-white/5 bg-slate-950/80 backdrop-blur-md relative z-10 mt-20">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="space-y-2 text-center md:text-left">
                    <h2 className="text-xl font-black gold-text italic uppercase tracking-tighter">
                        Fantasy Quizzes Kingdom
                    </h2>
                    <p className="text-amber-200/40 text-xs font-bold uppercase tracking-[0.3em]">
                        Where Knowledge Meets Speed
                    </p>
                </div>

                <nav className="flex flex-wrap justify-center gap-8 text-sm font-bold uppercase tracking-widest text-white/40">
                    <Link href="/FantasyQuizzesKingdom?view=top" className="hover:text-amber-500 transition-colors">
                        ホーム
                    </Link>
                    <Link href="/FantasyQuizzesKingdom/privacy" className="hover:text-amber-500 transition-colors">
                        プライバシーポリシー
                    </Link>
                    <Link href="/FantasyQuizzesKingdom/terms" className="hover:text-amber-500 transition-colors">
                        利用規約
                    </Link>
                    <Link
                        href="/FantasyQuizzesKingdom/contact"
                        className="hover:text-amber-500 transition-colors"
                    >
                        お問い合わせ
                    </Link>
                    <Link href="/" className="hover:text-amber-500 transition-colors">
                        Sparks Station
                    </Link>
                </nav>

                <div className="text-white/20 text-[10px] font-black tracking-[0.4em] uppercase">
                    © 2026 sparks-station.com
                </div>
            </div>
        </footer>
    );
}
