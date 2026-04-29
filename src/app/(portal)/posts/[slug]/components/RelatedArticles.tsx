import { getSortedPostsData, Post } from '@/lib/content';
import { getThemeForTag } from '@/lib/theme';
import Link from 'next/link';

type Props = {
    currentSlug: string;
    currentTags: string[];
};

function scorePost(post: Post, currentTags: string[]): number {
    return post.metadata.tags.filter(t => currentTags.includes(t)).length;
}

export default function RelatedArticles({ currentSlug, currentTags }: Props) {
    const allPosts = getSortedPostsData();

    const related = allPosts
        .filter(p => p.slug !== currentSlug)
        .map(p => ({ post: p, score: scorePost(p, currentTags) }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score || b.post.metadata.date.localeCompare(a.post.metadata.date))
        .slice(0, 3)
        .map(({ post }) => post);

    if (related.length === 0) return null;

    return (
        <section className="pt-12 border-t border-neutral-800 space-y-4">
            <h2 className="text-lg font-bold text-neutral-100 tracking-tight">関連記事</h2>
            <div className="grid gap-3">
                {related.map(post => {
                    const tag = post.metadata.tags[0] || '';
                    const theme = getThemeForTag(tag);
                    return (
                        <Link
                            key={post.slug}
                            href={`/posts/${post.slug}`}
                            className={`group flex gap-4 p-4 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900/40 hover:bg-neutral-800/50 transition-all`}
                        >
                            <div className={`mt-1 w-1 shrink-0 rounded-full self-stretch ${theme.primary.replace('text-', 'bg-')}`} />
                            <div className="flex-1 min-w-0 space-y-1">
                                <p className={`text-xs font-mono ${theme.primary}`}>{post.metadata.date}</p>
                                <p className="text-sm font-semibold text-neutral-200 group-hover:text-white transition-colors line-clamp-2 leading-snug">
                                    {post.metadata.title}
                                </p>
                                {post.metadata.mrr && (
                                    <p className={`text-xs font-mono ${theme.primary} opacity-80`}>MRR {post.metadata.mrr}</p>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
