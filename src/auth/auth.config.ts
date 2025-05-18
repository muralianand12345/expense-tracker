import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

export const authConfig: NextAuthConfig = {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const protectedPaths = ['/dashboard', '/settings'];
            const isOnProtectedPath = protectedPaths.some(path =>
                nextUrl.pathname === path || nextUrl.pathname.startsWith(`${path}/`)
            );

            if (isOnProtectedPath) {
                if (isLoggedIn) return true;
                return Response.redirect(new URL("/login", nextUrl));
            }

            return true;
        },
        session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub;
                // Add currency from token if present
                if (token.currency) {
                    session.user.currency = token.currency as string;
                }
            }
            return session;
        },
        jwt({ token, user, account }) {
            // Initial sign in
            if (user) {
                token.sub = user.id;
                token.currency = user.currency || 'USD';
            }
            return token;
        }
    }
};