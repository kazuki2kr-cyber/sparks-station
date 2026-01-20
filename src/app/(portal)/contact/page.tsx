
import { Metadata } from 'next';
import { Mail, Twitter } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Contact | Sparks Station',
};

export default function ContactPage() {
    return (
        <div className="max-w-3xl mx-auto space-y-12">
            <header className="space-y-4 border-b border-neutral-800 pb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white">Contact</h1>
                <p className="text-neutral-400">Get in touch with us.</p>
            </header>

            <div className="prose prose-invert prose-emerald max-w-none text-neutral-300">
                <p className="text-lg">
                    We welcome your feedback, questions, and partnership inquiries. Please feel free to reach out through any of the channels below.
                </p>

                <div className="grid md:grid-cols-2 gap-6 not-prose mt-8">
                    <a
                        href="https://twitter.com/kazuki2kr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-6 bg-neutral-800/50 border border-neutral-800 rounded-xl hover:border-emerald-500/50 hover:bg-neutral-800 transition-all group"
                    >
                        <div className="bg-emerald-500/10 p-3 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
                            <Twitter className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <div className="font-bold text-white">X (Twitter)</div>
                            <div className="text-sm text-neutral-500">@kazuki2kr</div>
                        </div>
                    </a>

                    <a
                        href="mailto:contact@sparks-station.com"
                        className="flex items-center gap-4 p-6 bg-neutral-800/50 border border-neutral-800 rounded-xl hover:border-emerald-500/50 hover:bg-neutral-800 transition-all group"
                    >
                        <div className="bg-emerald-500/10 p-3 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
                            <Mail className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <div className="font-bold text-white">Email</div>
                            <div className="text-sm text-neutral-500">contact@sparks-station.com</div>
                        </div>
                    </a>
                </div>

                <h2 className="mt-12">Operating Info</h2>
                <ul className="list-none pl-0 space-y-2">
                    <li><strong>Service Name:</strong> Sparks Station</li>
                    <li><strong>Operator:</strong> Ichikawa Kazuki</li>
                    <li><strong>Mission:</strong> Delivering global micro-SaaS insights to engineers.</li>
                </ul>
            </div>
        </div>
    );
}
