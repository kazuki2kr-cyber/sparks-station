import { Post } from '@/lib/content';
import PostCard from './PostCard';
import { Theme } from '@/lib/theme';

interface CategorySectionProps {
    title: string;
    description?: string;
    posts: Post[];
    theme: Theme;
}

export default function CategorySection({ title, description, posts, theme }: CategorySectionProps) {
    if (posts.length === 0) return null;

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

                {/* Optional: Add "View All" link here if needed later */}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <PostCard key={post.slug} post={post} />
                ))}
            </div>
        </section>
    );
}
