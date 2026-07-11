import { Post } from './content';
import { THEMES, Theme } from './theme';

export type CategoryType = 'ai' | 'cases';

export const CATEGORIES: Record<CategoryType, { title: string; description: string; theme: Theme; slug: string }> = {
    ai: {
        title: 'AI Updates',
        description: '最新AIと開発者ツールの変化を、日本で試せる使い方へ翻訳する。',
        theme: THEMES.blue,
        slug: 'ai'
    },
    cases: {
        title: 'Case Studies',
        description: '海外Micro-SaaS / AI SaaSの成功・失敗・Exitを、事業アイデアへ分解する。',
        theme: THEMES.amber,
        slug: 'cases'
    }
};

export function getPostCategory(post: Post): CategoryType {
    const tags = post.metadata.tags.map((tag) => tag.toLowerCase());
    const primary = tags[0] || '';
    const haystack = [
        post.metadata.title,
        post.metadata.summary,
        ...post.metadata.tags,
    ].join(' ').toLowerCase();

    if (primary === 'casestudy' || primary === 'successcase' || primary === 'failurecase') {
        return 'cases';
    }

    if (
        primary === 'aiupdate' ||
        primary === 'concept' ||
        primary === 'thought' ||
        tags.includes('ai') ||
        tags.includes('llm') ||
        tags.includes('techstack') ||
        tags.includes('product') ||
        haystack.includes('ai') ||
        haystack.includes('agent') ||
        haystack.includes('claude') ||
        haystack.includes('openai') ||
        haystack.includes('gemini') ||
        haystack.includes('cursor')
    ) {
        return 'ai';
    }

    return 'cases';
}

export function classifyPosts(posts: Post[]) {
    const categorized = {
        ai: [] as Post[],
        cases: [] as Post[]
    };

    posts.forEach(post => {
        const category = getPostCategory(post);
        categorized[category].push(post);
    });

    return categorized;
}
