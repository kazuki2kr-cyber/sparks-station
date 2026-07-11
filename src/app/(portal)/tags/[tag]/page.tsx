import { getSortedPostsData } from '@/lib/content';
import { CATEGORIES, classifyPosts } from '@/lib/classifier';
import CategorySection from '../../components/CategorySection';
import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';

type Props = {
    params: { tag: string };
};

const LEGACY_TAG_REDIRECTS: Record<string, string> = {
    AIUpdate: '/categories/ai',
    Concept: '/categories/ai',
    Thought: '/categories/ai',
    CaseStudy: '/categories/cases',
    SuccessCase: '/categories/cases',
    FailureCase: '/categories/cases',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const decodedTag = decodeURIComponent(resolvedParams.tag);
    return {
        title: `${decodedTag}の記事一覧`,
        description: `「${decodedTag}」タグの記事一覧 | Sparks Station`,
        alternates: {
            canonical: `/tags/${resolvedParams.tag}`,
        },
    };
}

export default async function TagPage({ params }: Props) {
    const resolvedParams = await params;
    const decodedTag = decodeURIComponent(resolvedParams.tag);
    if (LEGACY_TAG_REDIRECTS[decodedTag]) {
        redirect(LEGACY_TAG_REDIRECTS[decodedTag]);
    }

    const allPosts = getSortedPostsData();

    // Filter posts by tag
    const taggedPosts = allPosts.filter(post =>
        post.metadata.tags.some(tag => tag === decodedTag)
    );

    if (taggedPosts.length === 0) {
        notFound();
    }

    // Classify the filtered posts
    const classified = classifyPosts(taggedPosts);

    return (
        <div className="space-y-12 pb-20">
            {/* Page Header */}
            <div className="text-center space-y-4 py-8 border-b border-neutral-800">
                <div className="inline-flex items-center gap-2 text-sm text-neutral-500 mb-2">
                    <span>Tag</span>
                    <span>→</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                    {decodedTag}
                </h1>
                <p className="text-neutral-400 text-sm">
                    {taggedPosts.length} article{taggedPosts.length !== 1 ? 's' : ''} found
                </p>
            </div>

            {/* Category Sections */}
            <div className="space-y-12">
                {classified.ai.length > 0 && (
                    <CategorySection
                        title={CATEGORIES.ai.title}
                        description={CATEGORIES.ai.description}
                        posts={classified.ai}
                        theme={CATEGORIES.ai.theme}
                    />
                )}

                {classified.cases.length > 0 && (
                    <CategorySection
                        title={CATEGORIES.cases.title}
                        description={CATEGORIES.cases.description}
                        posts={classified.cases}
                        theme={CATEGORIES.cases.theme}
                    />
                )}
            </div>
        </div>
    );
}

// Generate static params for all tags
export async function generateStaticParams() {
    const allPosts = getSortedPostsData();
    const allTags = allPosts
        .flatMap(post => post.metadata.tags)
        .filter((tag) => !LEGACY_TAG_REDIRECTS[tag]);
    const uniqueTags = [...new Set(allTags)];

    return uniqueTags.map(tag => ({
        tag: encodeURIComponent(tag),
    }));
}
