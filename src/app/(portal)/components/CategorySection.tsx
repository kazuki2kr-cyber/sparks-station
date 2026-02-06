import Link from 'next/link';
import { Post } from '@/lib/content';
import PostCard from './PostCard';
import { Theme } from '@/lib/theme';

interface CategorySectionProps {
    title: string;
    description?: string;
    posts: Post[];
    theme: Theme;
    limit?: number;
    viewAllLink?: string;
}

export default function CategorySection({ title, description, posts, theme, limit, viewAllLink }: CategorySectionProps) {
    if (posts.length === 0) return null;

    const displayedPosts = limit ? posts.slice(0, limit) : posts;
    const hasMore = limit ? posts.length > limit : false;

    return (
        <section className="py-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-neutral-800 pb-4">
                <div>
                    <h2 className={`text-2xl md:text-3xl font-bold flex items-center gap-3 ${theme.heading}`}>
                        <span className={`w-1.5 h-8 ${theme.bg.replace('/10', '')} rounded-full`}></span>
                        {title}
                    </h2>
                    {description && (
                        <p className="text-neutral-500 mt-2 text-sm md:text-base ml-4">
                            {description}
                        </p>
                    )}
                </div>

                {viewAllLink && hasMore && (
                    <Link href={viewAllLink} className={`hidden md:flex items-center gap-2 text-sm font-medium ${theme.primary} hover:opacity-80 transition-opacity`}>
                        View All Cases →
                    </Link>
                )}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedPosts.map((post) => (
                    <PostCard key={post.slug} post={post} />
                ))}
            </div>

            {viewAllLink && hasMore && (
                <div className="mt-8 text-center md:hidden">
                    <Link href={viewAllLink} className={`inline-flex items-center gap-2 text-sm font-medium px-6 py-3 rounded-full border ${theme.border} ${theme.bg} ${theme.primary}`}>
                        View All Cases →
                    </Link>
                </div>
            )}
        </section>
    );
}
