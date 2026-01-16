import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://hayaoshi-quiz.vercel.app'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin', '/room/', '/host/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
