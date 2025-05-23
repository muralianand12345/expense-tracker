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
            const isOnApp = nextUrl.pathname.startsWith("/app");
            if (isOnApp) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn && nextUrl.pathname === "/login") {
                return Response.redirect(new URL("/app", nextUrl));
            }
            return true;
        },
        session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub;
                // Add any other fields from token if needed, like:
                if (token.currency) {
                    session.user.currency = token.currency as string;
                } else {
                    session.user.currency = 'USD'; // Default currency
                }
            }
            return session;
        },
        jwt({ token, user }) {
            // Add user data to the token when first signing in
            if (user) {
                token.sub = user.id;
                token.currency = user.currency || 'USD';
            }
            return token;
        }
    }
};