
import Link from 'next/link';
import { Terminal } from 'lucide-react';

export default function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-neutral-900 text-neutral-100 font-mono">
            {/* Header */}
            <header className="border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-emerald-500/10 p-2 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
                            <Terminal className="w-5 h-5 text-emerald-400" />
                        </div>
                        <span className="font-bold text-lg tracking-tight">MicroTrend Japan</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-400">
                        <Link href="/about" className="hover:text-emerald-400 transition-colors">About</Link>
                        <Link href="/quiz" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                            <span>Quiz App</span>
                            <span className="text-[10px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded border border-amber-500/20">DEMO</span>
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="max-w-screen-xl mx-auto px-6 py-12">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-neutral-800 bg-neutral-950 mt-auto">
                <div className="max-w-screen-xl mx-auto px-6 py-12 text-center text-sm text-neutral-500">
                    <p>&copy; {(new Date()).getFullYear()} MicroTrend Japan. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
