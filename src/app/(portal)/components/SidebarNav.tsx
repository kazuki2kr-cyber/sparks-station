import Link from 'next/link';
import { CATEGORIES } from '@/lib/classifier';
import { getSortedPostsData } from '@/lib/content';

export default function SidebarNav() {
    const allPosts = getSortedPostsData();

    // Extract unique tags from all posts (top 10)
    const allTags = allPosts.flatMap(post => post.metadata.tags);
    const tagCounts = allTags.reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    const topTags = Object.entries(tagCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([tag]) => tag);

    return (
        <div className="space-y-5">
            {/* Categories */}
            <div className="bg-neutral-800/30 border border-neutral-800 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-neutral-100 mb-4 uppercase tracking-wide">
                    Categories
                </h3>
                <div className="space-y-2">
                    <Link
                        href="/categories/success"
                        className="block text-sm text-emerald-400 hover:text-emerald-300 transition-colors py-1.5 border-b border-neutral-800 last:border-0"
                    >
                        Success Case & Tech →
                    </Link>
                    <Link
                        href="/categories/thought"
                        className="block text-sm text-purple-400 hover:text-purple-300 transition-colors py-1.5 border-b border-neutral-800 last:border-0"
                    >
                        Philosophy & Narrative →
                    </Link>
                    <Link
                        href="/categories/failure"
                        className="block text-sm text-rose-400 hover:text-rose-300 transition-colors py-1.5"
                    >
                        Failure & Lessons →
                    </Link>
                </div>
            </div>

            {/* Popular Tags */}
            <div className="bg-neutral-800/30 border border-neutral-800 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-neutral-100 mb-4 uppercase tracking-wide">
                    Popular Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                    {topTags.map(tag => (
                        <Link
                            key={tag}
                            href={`/tags/${encodeURIComponent(tag)}`}
                            className="inline-block px-2.5 py-1 bg-neutral-700/50 text-neutral-300 text-xs rounded border border-neutral-700 hover:border-emerald-500/50 hover:text-emerald-400 transition-all"
                        >
                            {tag}
                        </Link>
                    ))}
                </div>
            </div>

            {/* About */}
            <div className="bg-neutral-800/30 border border-neutral-800 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-neutral-100 mb-4 uppercase tracking-wide">
                    About
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                    世界の開発事例と先進思想を蓄積し、プロダクトとして形にするSaaS Analysis & Studio。事例研究と次世代概念の探求を通じて、ビジネスと技術の種火を生み出します。
                </p>
                <Link
                    href="/about"
                    className="inline-flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                    → About this site
                </Link>
            </div>
        </div>
    );
}
