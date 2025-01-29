import NextAuth, { type NextAuthConfig, type User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcryptjs from 'bcryptjs';
import { z } from 'zod';

import prisma from './lib/prisma';


declare module 'next-auth' {
  interface User {
    UserID: number;
    Email: string;
    Name: string;
    Status: boolean;
    TypeDocID: number;
    NroDoc: string;
    RoleID: number;
    LastName: string | null;
    PickupPointID: number | null;
    CreatedAt: Date | null;
    UpdatedAt: Date | null;
  }
}

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/new-account',
  },

  callbacks: {

    authorized({ auth, request: { nextUrl } }) {
      return true;
    },

    jwt({ token, user }) {
      if (user) {

        token.data = user;

      }

      return token;
    },

    session({ session, token, user }) {
      session.user = token.data as any;


      return session;
    },



  },



  providers: [

    Credentials({
      async authorize(credentials) {

        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        // console.log(parsedCredentials);
        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;

        // console.log(email, password)

        // Encontrar el usuario por el correo activo
        const user = await prisma.users.findUnique({
          where: {
            Email: email,
            Status: true
          },
        })

        if (!user) return null;

        // console.log(user)

        if (!bcryptjs.compareSync(password, user.Password)) return null;


        // console.log(user)

        // Regresar el usuario sin el password
        const { Password: _, ...rest } = user;

        return rest;
      },
    }),


  ]
}



export const { signIn, signOut, auth, handlers } = NextAuth(authConfig);