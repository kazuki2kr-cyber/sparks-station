import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://sparks-station.com'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/quiz/admin', '/quiz/room/', '/quiz/host/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
