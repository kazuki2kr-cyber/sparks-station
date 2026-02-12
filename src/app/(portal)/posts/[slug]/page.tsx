
import { getPostData, getSortedPostsData } from '@/lib/content';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getThemeForTag } from '@/lib/theme';
import FeedbackSection from '../../components/FeedbackSection';

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    try {
        const post = await getPostData(slug);
        return {
            title: `${post.metadata.title} | Sparks Station`,
            description: post.metadata.summary,
            alternates: {
                canonical: `/posts/${slug}`,
            },
            openGraph: {
                title: post.metadata.title,
                description: post.metadata.summary,
                type: 'article',
                publishedTime: post.metadata.date,
                authors: ['Sparks Station'],
                tags: post.metadata.tags,
            },
            twitter: {
                card: 'summary_large_image',
                title: post.metadata.title,
                description: post.metadata.summary,
            },
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

    const mainTag = post.metadata.tags[0] || 'Tech';
    const theme = getThemeForTag(mainTag);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.metadata.title,
        description: post.metadata.summary,
        datePublished: post.metadata.date,
        author: {
            '@type': 'Organization',
            name: 'Sparks Station',
            url: 'https://sparks-station.com'
        },
        publisher: {
            '@type': 'Organization',
            name: 'Sparks Station',
            logo: {
                '@type': 'ImageObject',
                url: 'https://sparks-station.com/icon.png'
            }
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://sparks-station.com/posts/${slug}`
        }
    };

    return (
        <article className="max-w-3xl mx-auto space-y-12">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Header */}
            <header className="space-y-6 text-center">
                <div className={`flex items-center justify-center gap-4 text-sm font-mono ${theme.primary}`}>
                    <time dateTime={post.metadata.date}>{post.metadata.date}</time>
                    <span>•</span>
                    <div className="flex gap-2">
                        {post.metadata.tags.map(tag => (
                            <span key={tag} className={`${theme.bg} px-2 py-0.5 rounded border ${theme.border}`}>
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                    {post.metadata.title}
                </h1>

                {/* Metrics Card */}
                {/* Metrics Card - Hidden as per request */}
                {/* 
                <div className="bg-neutral-800/50 border border-neutral-800 rounded-2xl p-6 md:p-8 max-w-2xl mx-auto flex justify-between items-center text-center">
                    <div>
                        <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">MRR (月商)</div>
                        <div className={`text-2xl md:text-3xl font-bold font-mono ${theme.metricValue}`}>
                            {post.metadata.mrr || 'N/A'}
                        </div>
                    </div>
                    <div className="w-px h-12 bg-neutral-800"></div>
                    <div>
                        <div className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Sold (売却額)</div>
                        <div className={`text-2xl md:text-3xl font-bold font-mono ${theme.metricValue === 'text-emerald-400' ? 'text-amber-400' : 'text-purple-300'}`}>
                            {post.metadata.exit_price || 'N/A'}
                        </div>
                    </div>
                </div> 
                */}
            </header>

            {/* Content using standard Prose styles but customized for dark mode */}
            <div className={`prose prose-invert ${theme.prose} max-w-none 
                prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-neutral-100
                prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b prose-h2:border-neutral-800
                ${theme.heading} prose-h3:text-xl md:prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-neutral-300 prose-p:leading-7 prose-p:text-base md:prose-p:text-lg prose-p:mb-5 prose-p:tracking-normal
                prose-li:text-neutral-300 prose-li:leading-7 prose-li:my-1
                prose-ul:my-5 prose-ul:list-disc prose-ul:pl-5
                prose-hr:my-12 prose-hr:border-neutral-800
                prose-strong:text-white prose-strong:font-bold
                prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8 prose-img:border prose-img:border-neutral-700/50
                prose-code:${theme.codeText} prose-code:${theme.codeBg} prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
                `}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
            </div>

            {/* Feedback & Comments */}
            <FeedbackSection slug={post.slug} />

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
