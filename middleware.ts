import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose'

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Protected Admin Routes
    if (pathname.startsWith('/admin/dashboard') || pathname.startsWith('/api/admin/')) {
        // Skip login API itself
        if (pathname === '/api/admin/login') {
            return NextResponse.next();
        }

        const token = request.cookies.get('hackspectra_admin_auth')?.value

        if (!token) {
            if (pathname.startsWith('/api/')) {
                return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
            }
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }

        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET)
            const { payload } = await jose.jwtVerify(token, secret)

            if (payload.admin !== true) {
                throw new Error('Not an admin')
            }

            return NextResponse.next()
        } catch (error) {
            console.error('Admin middleware auth error:', error)
            if (pathname.startsWith('/api/')) {
                return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 })
            }
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
    }

    return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/admin/dashboard/:path*',
        '/api/admin/:path*',
    ],
}
