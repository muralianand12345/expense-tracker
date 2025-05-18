import { auth } from '@/auth/auth';

export default auth;

// Specify which routes should be protected
export const config = {
    // Match all paths that should be protected
    matcher: [
        '/dashboard/:path*',
        '/settings/:path*',
        '/api/:path*',
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg|login|).*)',
    ],
};