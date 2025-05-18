import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut
} = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    callbacks: {
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub as string;

                // Fetch the latest user data from the database to get current currency
                const user = await prisma.user.findUnique({
                    where: { id: token.sub as string },
                    select: { currency: true }
                });

                // Update the session with the latest currency
                if (user) {
                    session.user.currency = user.currency;
                }
            }
            return session;
        },
        jwt: authConfig.callbacks.jwt,
    },
    ...authConfig,
});