"use client";

import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full py-10 px-6 border-t border-white/5 bg-neutral-950/80 backdrop-blur-md relative z-10 mt-16">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="space-y-2 text-center md:text-left">
                    <h2 className="text-xl font-black text-white uppercase tracking-tight">
                        Sparks Station
                    </h2>
                    <p className="text-neutral-500 text-xs font-bold uppercase tracking-[0.3em]">
                        SaaS patterns translated into action
                    </p>
                </div>

                <nav className="flex flex-wrap justify-center gap-6 text-sm font-bold uppercase tracking-widest text-white/40">
                    <Link href="/products" className="hover:text-emerald-400 transition-colors">
                        Products
                    </Link>
                    <Link href="/contact" className="hover:text-emerald-400 transition-colors">
                        Contact
                    </Link>
                    <Link href="/privacy" className="hover:text-emerald-400 transition-colors">
                        Privacy
                    </Link>
                    <Link href="/terms" className="hover:text-emerald-400 transition-colors">
                        Terms
                    </Link>
                </nav>

                <div className="text-white/20 text-[10px] font-black tracking-[0.4em] uppercase">
                    © 2026 sparks-station.com
                </div>
            </div>
        </footer>
    );
}
