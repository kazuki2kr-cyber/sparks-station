import Link from 'next/link';
import { Post } from '@/lib/content';
import { getThemeForTag } from '@/lib/theme';

export default function PostCard({ post }: { post: Post }) {
    const mainTag = post.metadata.tags[0] || 'Tech';
    const theme = getThemeForTag(mainTag);

    return (
        <Link href={`/posts/${post.slug}`} className="block group h-full">
            <article className={`bg-neutral-800/50 border border-neutral-800 rounded-2xl overflow-hidden transition-all duration-300 h-full flex flex-col shadow-lg hover:-translate-y-1 ${theme.hoverBorder} ${theme.hoverShadow}`}>
                {/* Visual Thumbnail */}
                <div className={`aspect-video relative overflow-hidden flex items-center justify-center bg-gradient-to-br ${theme.gradient}`}>
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>

                    {/* Tag Overlay */}
                    <div className="relative z-10 text-white font-bold text-3xl md:text-4xl tracking-tighter opacity-90 drop-shadow-md transform group-hover:scale-105 transition-transform duration-500 text-center px-4 leading-tight">
                        {mainTag.replace(/([a-z])([A-Z][a-z])/g, '$1 $2').trim()}
                    </div>

                    {/* Decorative shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-white/10 opacity-60"></div>
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
                        <div className="text-neutral-500">MRR: <span className="text-neutral-300 font-bold">{post.metadata.mrr || 'N/A'}</span></div>
                        <div className="text-neutral-500">Sold: <span className="text-neutral-300 font-bold">{post.metadata.exit_price || 'N/A'}</span></div>
                    </div>
                </div>
            </article>
        </Link>
    );
}
