import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Fantasy Quizzes Kingdom',
        short_name: 'FQK',
        description: 'A fantasy-themed quiz RPG application.',
        start_url: '/FantasyQuizzesKingdom',
        display: 'standalone',
        background_color: '#0f172a', // Dark blue (slate-900 like) from the theme
        theme_color: '#fbbf24', // Gold (amber-400 like)
        icons: [
            {
                src: '/icons/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icons/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}
