import Link from 'next/link';
import { Post } from '@/lib/content';
import { getThemeForTag } from '@/lib/theme';
import PostStats from './PostStats';

export default function HeroSection({ post }: { post: Post }) {
    const mainTag = post.metadata.tags[0] || 'Tech';
    const theme = getThemeForTag(mainTag);

    return (
        <section className="w-full">
            <Link href={`/posts/${post.slug}`} className="block group relative">
                <div className={`relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/50 shadow-2xl transition-all duration-500 hover:shadow-${theme.primary}/20`}>
                    <div className="grid md:grid-cols-12 gap-0">
                        {/* Visual Side */}
                        <div className={`md:col-span-7 aspect-video md:aspect-auto relative overflow-hidden min-h-[300px] md:min-h-[400px] flex items-center justify-center bg-gradient-to-br ${theme.gradient}`}>
                            <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>

                            {/* Tag Overlay - Large */}
                            <div className="relative z-10 text-white font-bold text-4xl md:text-6xl tracking-tighter opacity-90 drop-shadow-lg transform group-hover:scale-105 transition-transform duration-700 text-center px-4 leading-tight">
                                {mainTag.replace(/([a-z])([A-Z][a-z])/g, '$1 $2').trim()}
                            </div>

                            {/* Decorative shine */}
                            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-white/10 opacity-60"></div>
                        </div>

                        {/* Content Side */}
                        <div className="md:col-span-5 p-8 md:p-12 flex flex-col justify-center relative bg-neutral-900/50 backdrop-blur-sm">
                            <div className={`inline-flex items-center gap-2 text-sm font-mono mb-6 ${theme.primary}`}>
                                <span className={`${theme.bg} px-2 py-1 rounded border ${theme.border}`}>LATEST SPARK</span>
                                <span>{post.metadata.date}</span>
                            </div>

                            <h2 className={`text-3xl md:text-4xl font-bold text-neutral-100 mb-6 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r ${theme.gradient} transition-all duration-300`}>
                                {post.metadata.title}
                            </h2>

                            <p className="text-neutral-400 text-lg leading-relaxed mb-8 line-clamp-3 md:line-clamp-4">
                                {post.metadata.summary}
                            </p>

                            <div className="mt-auto pt-6 border-t border-neutral-800 flex items-center justify-between">
                                <span className={`text-sm font-medium ${theme.primary} flex items-center gap-2 group-hover:translate-x-1 transition-transform`}>
                                    Read Article →
                                </span>
                                <PostStats slug={post.slug} theme={theme} />
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </section>
    );
}
