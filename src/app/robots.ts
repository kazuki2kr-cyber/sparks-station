import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://sparks-station.com'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/FantasyQuizzesKingdom/',
            ],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
