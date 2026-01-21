
import Link from 'next/link';
import { Post } from '@/lib/content';

// Pre-defined fancy gradients
const GRADIENTS = [
    'from-pink-500 via-red-500 to-yellow-500',
    'from-indigo-500 via-purple-500 to-pink-500',
    'from-green-400 via-emerald-500 to-teal-500',
    'from-blue-400 via-cyan-500 to-teal-400',
    'from-orange-400 via-amber-500 to-yellow-400',
    'from-rose-400 via-fuchsia-500 to-indigo-500',
];

// Function to pick a gradient based on the tag string
function getGradient(tag: string) {
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
        hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % GRADIENTS.length;
    return GRADIENTS[index];
}

import { getThemeForTag } from '@/lib/theme';

export default function PostCard({ post }: { post: Post }) {
    const mainTag = post.metadata.tags[0] || 'Tech';
    const gradient = getGradient(mainTag);
    const theme = getThemeForTag(mainTag);

    return (
        <Link href={`/posts/${post.slug}`} className="block group h-full">
            <article className={`bg-neutral-800/50 border border-neutral-800 rounded-2xl overflow-hidden transition-all duration-300 h-full flex flex-col shadow-lg hover:-translate-y-1 ${theme.hoverBorder} ${theme.hoverShadow}`}>
                {/* Visual Thumbnail */}
                <div className={`aspect-video relative overflow-hidden flex items-center justify-center bg-gradient-to-br ${gradient}`}>
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>

                    {/* Tag Overlay */}
                    <div className="relative z-10 text-white font-bold text-3xl md:text-4xl tracking-tighter opacity-90 drop-shadow-md transform group-hover:scale-105 transition-transform duration-500">
                        {mainTag}
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
