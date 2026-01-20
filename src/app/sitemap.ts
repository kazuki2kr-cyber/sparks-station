import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://sparks-station.com'

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
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
        {
            url: `${baseUrl}/quiz/contact`,
            lastModified: new Date(),
            priority: 0.5,
        },
        {
            url: `${baseUrl}/quiz/privacy`,
            lastModified: new Date(),
            priority: 0.3,
        },
        {
            url: `${baseUrl}/quiz/terms`,
            lastModified: new Date(),
            priority: 0.3,
        },
    ]
}
