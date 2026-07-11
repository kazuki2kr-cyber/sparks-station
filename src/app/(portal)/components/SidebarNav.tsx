import Link from 'next/link';
import { getSortedPostsData } from '@/lib/content';

const HIDDEN_TAGS = new Set(['AIUpdate', 'CaseStudy', 'SuccessCase', 'FailureCase', 'Concept', 'Thought']);

export default function SidebarNav() {
    const allPosts = getSortedPostsData();

    // Extract unique tags from all posts (top 10)
    const allTags = allPosts.flatMap(post => post.metadata.tags).filter((tag) => !HIDDEN_TAGS.has(tag));
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
                        href="/categories/ai"
                        className="block text-sm text-cyan-400 hover:text-cyan-300 transition-colors py-1.5 border-b border-neutral-800 last:border-0"
                    >
                        AI Updates →
                    </Link>
                    <Link
                        href="/categories/cases"
                        className="block text-sm text-emerald-400 hover:text-emerald-300 transition-colors py-1.5"
                    >
                        Case Studies →
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
                    AIの変化と海外SaaS事例を、日本で試せるプロダクト仮説へ翻訳するSaaS Analysis & Studio。
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
