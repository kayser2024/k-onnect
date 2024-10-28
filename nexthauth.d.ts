
import NextAuth, { DefaultSession } from "next-auth";
import { string } from "zod";

declare module 'next-auth' {
    interface Session {
        user: {
            dni: string
            name: string
            lastName: string
            email: string
            emailVerified: string
            password: string
            image: string
            rolId: number
        } & DefaultSession
    }
}