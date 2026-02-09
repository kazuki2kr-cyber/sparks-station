import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Get hostname (e.g. 'www.sparks-station.com')
    const hostname = request.headers.get('host') || ''

    // Check if it starts with 'www.'
    if (hostname.startsWith('www.')) {
        // Construct the new URL without 'www.'
        const newHostname = hostname.replace('www.', '')
        const url = new URL(request.url)
        url.hostname = newHostname
        url.protocol = 'https' // Enforce https

        // Return 301 Moved Permanently
        return NextResponse.redirect(url, 301)
    }

    // Continue if no redirect needed
    return NextResponse.next()
}

export const config = {
    // Apply to all requests except next static files, images, etc.
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
