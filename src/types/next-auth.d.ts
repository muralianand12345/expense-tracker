import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            currency: string;
        } & DefaultSession["user"];
    }

    interface User {
        currency?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        currency?: string;
    }
}