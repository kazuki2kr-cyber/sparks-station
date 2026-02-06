import Link from 'next/link';
import { Post } from '@/lib/content';
import { getThemeForTag } from '@/lib/theme';
import PostStats from './PostStats';

export default function PostCard({ post }: { post: Post }) {
    const mainTag = post.metadata.tags[0] || 'Tech';
    const theme = getThemeForTag(mainTag);

    return (
        <Link href={`/posts/${post.slug}`} className="block group h-full">
            <article className={`bg-neutral-800/50 border border-neutral-800 rounded-2xl overflow-hidden transition-all duration-300 h-full flex flex-col shadow-lg hover:-translate-y-1 ${theme.hoverBorder} ${theme.hoverShadow}`}>
                {/* Visual Thumbnail */}
                {/* Visual Thumbnail - Minimalist Badge Style */}
                <div className={`aspect-video relative overflow-hidden bg-gradient-to-br ${theme.gradient}`}>
                    <div className="absolute inset-0 bg-black/10 backdrop-blur-[0px]"></div>

                    {/* Corner Badge */}
                    <div className="absolute top-3 right-3 z-10">
                        <span className="inline-block bg-black/20 backdrop-blur-md border border-white/10 text-white/90 text-[10px] font-bold px-2 py-1 rounded tracking-wide shadow-sm">
                            {mainTag}
                        </span>
                    </div>

                    {/* Decorative shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/5 opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
                </div>

                <div className="p-6 space-y-4 flex-grow flex flex-col">
                    <div className={`flex items-center gap-3 text-xs font-mono ${theme.primary}`}>
                        <span>{post.metadata.date}</span>
                        <span>•</span>
                        <div className="flex gap-2">
                            {post.metadata.tags.slice(0, 2).map(tag => (
                                <span key={tag} className={`${theme.bg} px-1.5 py-0.5 rounded border ${theme.border}`}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <h3 className={`text-xl font-bold text-neutral-100 transition-colors line-clamp-2 leading-snug ${theme.groupHoverText}`}>
                        {post.metadata.title}
                    </h3>

                    <p className="text-sm text-neutral-400 line-clamp-3 mb-auto leading-relaxed">
                        {post.metadata.summary}
                    </p>

                    <div className="pt-4 flex items-center justify-between text-xs font-mono border-t border-neutral-700/50 mt-5 w-full">
                        {/* Stats Footer (Integrated into card) */}
                        <PostStats slug={post.slug} theme={theme} />
                    </div>
                </div>
            </article>
        </Link>
    );
}
