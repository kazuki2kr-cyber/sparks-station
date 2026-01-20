import { MetadataRoute } from 'next'
import { getSortedPostsData } from '@/lib/content'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://sparks-station.com'
    const posts = getSortedPostsData()

    const postUrls = posts.map((post) => ({
        url: `${baseUrl}/posts/${post.slug}`,
        lastModified: new Date(post.metadata.date),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }))

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        // Portal Static Pages
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        ...postUrls,
        // Quiz App URLs
        {
            url: `${baseUrl}/quiz`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/quiz/solo`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
    ]
}
