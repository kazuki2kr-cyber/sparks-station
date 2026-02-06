import { getSortedPostsData } from '@/lib/content';
import { CATEGORIES, CategoryType, classifyPosts } from '@/lib/classifier';
import PostCard from '../../components/PostCard';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export async function generateStaticParams() {
    return Object.keys(CATEGORIES).map((slug) => ({
        slug: slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const categoryKey = slug as CategoryType;
    const category = CATEGORIES[categoryKey];

    if (!category) {
        return {
            title: 'Category Not Found',
        };
    }

    return {
        title: `${category.title} | Sparks Station`,
        description: category.description,
    };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const categoryKey = slug as CategoryType;
    const category = CATEGORIES[categoryKey];

    if (!category) {
        notFound();
    }

    const allPosts = getSortedPostsData();
    const classified = classifyPosts(allPosts);
    const posts = classified[categoryKey];

    return (
        <div className="space-y-12 py-12">
            <header className="border-b border-neutral-800 pb-8">
                <h1 className={`text-4xl font-bold mb-4 flex items-center gap-4 ${category.theme.heading}`}>
                    <span className={`w-2 h-10 ${category.theme.bg.replace('/10', '')} rounded-full`}></span>
                    {category.title}
                </h1>
                <p className="text-xl text-neutral-400 max-w-3xl leading-relaxed">
                    {category.description}
                </p>
            </header>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <PostCard key={post.slug} post={post} />
                ))}
            </div>

            {posts.length === 0 && (
                <div className="text-neutral-500 py-20 text-center">
                    該当する記事はまだありません。
                </div>
            )}
        </div>
    );
}
