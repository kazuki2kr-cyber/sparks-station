import Link from 'next/link';
import SiteHeader from './components/SiteHeader';

export default function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-neutral-900 text-neutral-100 font-mono">
            {/* Header */}
            <SiteHeader />

            <main className="max-w-screen-xl mx-auto px-6 py-12">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-neutral-800 bg-neutral-950 mt-auto">
                <div className="max-w-screen-xl mx-auto px-6 py-12 flex flex-col items-center gap-6 text-sm text-neutral-500">
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-neutral-300 transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-neutral-300 transition-colors">Terms of Service</Link>
                        <Link href="/contact" className="hover:text-neutral-300 transition-colors">Contact</Link>
                    </div>
                    <p>&copy; {(new Date()).getFullYear()} Sparks Station. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
