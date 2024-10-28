import NextAuth, { type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcryptjs from 'bcryptjs';
import { z } from 'zod';

import prisma from './lib/prisma';



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

        console.log(parsedCredentials);
        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;

        console.log(email,password)

        // Buscar el correo

        const user = await prisma.usuarios.findUnique({
          where: {
            email: email,
          },
        }
        )

        console.log(user)

        if (!user) return null;

        console.log(user)

        if (!bcryptjs.compareSync(password, user.password)) return null;


        console.log(user)

        // Regresar el usuario sin el password
        const { password: _, ...rest } = user;

        return rest;
      },
    }),


  ]
}



export const { signIn, signOut, auth, handlers } = NextAuth(authConfig);