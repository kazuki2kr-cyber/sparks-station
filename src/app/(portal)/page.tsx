import { getSortedPostsData, Post } from '@/lib/content';
import { getThemeForTag, THEMES } from '@/lib/theme';
import HeroSection from './components/HeroSection';
import CategorySection from './components/CategorySection';
import { Metadata } from 'next';

export const metadata: Metadata = {
    alternates: {
        canonical: '/',
    },
};

export default async function PortalPage() {
    const allPosts = getSortedPostsData();

    if (allPosts.length === 0) {
        return <div className="text-center py-20 text-neutral-500">No posts found.</div>;
    }

    // 1. Latest Post (Hero)
    const latestPost = allPosts[0];
    const remainingPosts = allPosts.slice(1);

    // 2. Categorize remaining posts
    const successPosts: Post[] = [];
    const thoughtPosts: Post[] = [];
    const failurePosts: Post[] = [];

    remainingPosts.forEach(post => {
        const mainTag = post.metadata.tags[0] || '';
        const theme = getThemeForTag(mainTag);

        if (theme === THEMES.rose) {
            failurePosts.push(post);
        } else if (theme === THEMES.purple) {
            thoughtPosts.push(post);
        } else {
            // Emerald and Blue themes go here (Success/Tech)
            successPosts.push(post);
        }
    });

    return (
        <div className="space-y-20 pb-20">
            {/* Hero Section */}
            <HeroSection post={latestPost} />

            {/* Category Sections */}
            <div className="space-y-16">
                <CategorySection
                    title="Success Case & Tech"
                    description="世界の最先端事例と、実装のための技術スタック。"
                    posts={successPosts}
                    theme={THEMES.emerald}
                />

                <CategorySection
                    title="Philosophy & Narrative"
                    description="プロダクトの魂となる「思想」と「物語」。"
                    posts={thoughtPosts}
                    theme={THEMES.purple}
                />

                <CategorySection
                    title="Failure Cases"
                    description="先人たちの失敗から学ぶ、生存への羅針盤。"
                    posts={failurePosts}
                    theme={THEMES.rose}
                />
            </div>
        </div>
    );
}
