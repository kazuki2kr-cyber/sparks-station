import { Post } from './content';
import { getThemeForTag, THEMES, Theme } from './theme';

export type CategoryType = 'success' | 'thought' | 'failure';

export const CATEGORIES: Record<CategoryType, { title: string; description: string; theme: Theme; slug: string }> = {
    success: {
        title: 'Success Case & Tech',
        description: '世界の最先端事例と、実装のための技術スタック。',
        theme: THEMES.emerald,
        slug: 'success'
    },
    thought: {
        title: 'Philosophy & Narrative',
        description: 'プロダクトの魂となる「思想」と「物語」。',
        theme: THEMES.purple,
        slug: 'thought'
    },
    failure: {
        title: 'Failure Cases',
        description: '先人たちの失敗から学ぶ、生存への羅針盤。',
        theme: THEMES.rose,
        slug: 'failure'
    }
};

export function getPostCategory(post: Post): CategoryType {
    const mainTag = post.metadata.tags[0] || '';
    const theme = getThemeForTag(mainTag);

    if (theme === THEMES.rose) {
        return 'failure';
    } else if (theme === THEMES.purple) {
        return 'thought';
    } else {
        return 'success';
    }
}

export function classifyPosts(posts: Post[]) {
    const categorized = {
        success: [] as Post[],
        thought: [] as Post[],
        failure: [] as Post[]
    };

    posts.forEach(post => {
        const category = getPostCategory(post);
        categorized[category].push(post);
    });

    return categorized;
}
