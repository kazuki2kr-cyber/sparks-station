
import { getPostData, getSortedPostsData } from '@/lib/content';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    try {
        const post = await getPostData(slug);
        return {
            title: `${post.metadata.title} | MicroTrend Japan`,
            description: post.metadata.summary,
        };
    } catch {
        return {
            title: 'Article Not Found',
        };
    }
}

export async function generateStaticParams() {
    const posts = getSortedPostsData();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export default async function PostPage({ params }: Props) {
    const { slug } = await params;
    let post;
    try {
        post = await getPostData(slug);
    } catch {
        notFound();
    }

    return (
        <article className="max-w-3xl mx-auto space-y-12">
            {/* Header */}
            <header className="space-y-6 text-center">
                <div className="flex items-center justify-center gap-4 text-sm font-mono text-emerald-400">
                    <time dateTime={post.metadata.date}>{post.metadata.date}</time>
                    <span>•</span>
                    <div className="flex gap-2">
                        {post.metadata.tags.map(tag => (
                            <span key={tag} className="bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                    {post.metadata.title}
                </h1>

                {/* Metrics Card */}
                <div className="bg-neutral-800/50 border border-neutral-800 rounded-2xl p-6 md:p-8 max-w-2xl mx-auto flex justify-between items-center text-center">
                    <div>
                        <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">MRR (月商)</div>
                        <div className="text-2xl md:text-3xl font-bold text-emerald-400 font-mono">
                            {post.metadata.mrr || 'N/A'}
                        </div>
                    </div>
                    <div className="w-px h-12 bg-neutral-800"></div>
                    <div>
                        <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Sold (売却額)</div>
                        <div className="text-2xl md:text-3xl font-bold text-amber-400 font-mono">
                            {post.metadata.exit_price || 'N/A'}
                        </div>
                    </div>
                </div>
            </header>

            {/* Content using standard Prose styles but customized for dark mode */}
            <div className="prose prose-invert prose-emerald max-w-none 
                prose-headings:font-bold prose-headings:tracking-tight
                prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:scroll-m-20 prose-h2:border-b prose-h2:border-neutral-800 prose-h2:pb-2
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
                prose-p:text-neutral-300 prose-p:leading-relaxed prose-p:text-lg
                prose-li:text-neutral-300
                prose-strong:text-white prose-strong:font-bold
                prose-code:text-emerald-300 prose-code:bg-emerald-950/30 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
                ">
                <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>

            {/* Footer / Navigation */}
            <div className="pt-12 border-t border-neutral-800 mt-16 flex justify-center">
                <Link href="/" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group">
                    <span className="group-hover:-translate-x-1 transition-transform">←</span>
                    Back to Top
                </Link>
            </div>
        </article>
    );
}
