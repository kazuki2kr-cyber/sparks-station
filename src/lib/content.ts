import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'src/content/posts');

export type PostMetadata = {
    title: string;
    date: string;
    tags: string[];
    summary: string;
    mrr?: string;
    exit_price?: string;
    isPremium?: boolean;
};

export type Post = {
    slug: string;
    content: string;
    metadata: PostMetadata;
};

export function getSortedPostsData(): Post[] {
    // Create folder if it doesn't exist
    if (!fs.existsSync(postsDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames.map((fileName) => {
        // Remove ".md" from file name to get id
        const slug = fileName.replace(/\.md$/, '');

        // Read markdown file as string
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // Use gray-matter to parse the post metadata section
        const { data, content } = matter(fileContents);

        return {
            slug,
            content,
            metadata: data as PostMetadata,
        };
    });

    // Sort posts by date
    return allPostsData.sort((a, b) => {
        if (a.metadata.date < b.metadata.date) {
            return 1;
        } else {
            return -1;
        }
    });
});
}

export async function getPostData(slug: string): Promise<Post> {
    const fullPath = path.join(postsDirectory, `${slug}.md`);

    if (!fs.existsSync(fullPath)) {
        throw new Error('Post not found');
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const { data, content } = matter(fileContents);

    return {
        slug,
        content,
        metadata: data as PostMetadata,
    };
}

