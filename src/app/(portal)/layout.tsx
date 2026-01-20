
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
                        {/* Brand Logo Image */}
                        <div className="relative w-40 h-10">
                            <img
                                src="/sparks-station-kv.png"
                                alt="Sparks Station"
                                className="object-contain w-full h-full"
                            />
                        </div>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-400">
                        <Link href="/" className="hover:text-emerald-400 transition-colors">Insights</Link>
                        <Link href="/products" className="hover:text-emerald-400 transition-colors">Products</Link>
                        <Link href="/about" className="hover:text-emerald-400 transition-colors">About</Link>
                    </nav>
                </div>
            </header>

            <main className="max-w-screen-xl mx-auto px-6 py-12">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-neutral-800 bg-neutral-950 mt-auto">
                <div className="max-w-screen-xl mx-auto px-6 py-12 flex flex-col items-center gap-6 text-sm text-neutral-500">
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-neutral-300 transition-colors">Privacy Policy</Link>
                        <Link href="/contact" className="hover:text-neutral-300 transition-colors">Contact</Link>
                    </div>
                    <p>&copy; {(new Date()).getFullYear()} Sparks Station. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
