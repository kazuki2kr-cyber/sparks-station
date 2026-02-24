import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://sparks-station.com'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/FantasyQuizzesKingdom/admin',
                '/FantasyQuizzesKingdom/room/',
                '/FantasyQuizzesKingdom/host/',
                '/FantasyQuizzesKingdom/debug',
                '/FantasyQuizzesKingdom/design-preview',
            ],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
