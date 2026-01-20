import { getSortedPostsData } from '@/lib/content';

export default function PortalPage() {
    const posts = getSortedPostsData();

    return (
        <div className="space-y-16">
            {/* Hero Section */}
            <section className="text-center space-y-6 py-12">
                <div className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-medium border border-emerald-500/20 mb-4">
                    Micro-SaaS Trends for Engineers
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white max-w-3xl mx-auto leading-tight">
                    海外の売却事例から<br className="hidden md:block" />
                    <span className="text-emerald-400">「稼げるヒント」</span>をエンジニアへ。
                </h1>
                <p className="text-neutral-400 max-w-xl mx-auto text-lg leading-relaxed">
                    開発力はある。アイデアと売り方がわからない。
                    <br />そんな個人開発者のために、実際のExit事例とTech Stackを分析して届けます。
                </p>
            </section>

            {/* Featured Articles */}
            <section>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
                        Latest Analysis
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                        <article key={post.slug} className="group bg-neutral-800/50 border border-neutral-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-colors">
                            <div className="aspect-video bg-neutral-800 relative overflow-hidden flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-60"></div>
                                {/* Generative Placeholder for thumbnail */}
                                <div className="text-neutral-700 text-6xl font-bold opacity-20 select-none">
                                    {post.metadata.tags[0]}
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center gap-3 text-xs font-mono text-emerald-400">
                                    <span>{post.metadata.date}</span>
                                    <span>•</span>
                                    <span>{post.metadata.tags[0]}</span>
                                </div>
                                <h3 className="text-xl font-bold text-neutral-100 group-hover:text-emerald-400 transition-colors line-clamp-2">
                                    {post.metadata.title}
                                </h3>
                                <p className="text-sm text-neutral-400 line-clamp-2">
                                    {post.metadata.summary}
                                </p>
                                <div className="pt-4 flex items-center justify-between text-xs font-mono border-t border-neutral-700/50">
                                    <div className="text-neutral-500">MRR: <span className="text-neutral-300">{post.metadata.mrr || 'N/A'}</span></div>
                                    <div className="text-neutral-500">Sold: <span className="text-neutral-300">{post.metadata.exit_price || 'N/A'}</span></div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    );
}
