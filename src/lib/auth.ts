import type { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { dbConnect, hasDatabase } from './mongodb';
import { AdminUser } from '@/models/AdminUser';

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt', maxAge: 60 * 60 * 8 /* 8h */ },
  pages: { signIn: '/admin/login' },
  providers: [
    Credentials({
      name: 'Admin Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(creds) {
        if (!creds?.email || !creds?.password) return null;

        // Dev fallback: when no database is configured, allow the seed admin
        // credentials from .env so the dashboard can be previewed locally.
        if (!hasDatabase) {
          const devEmail = process.env.ADMIN_EMAIL;
          const devPassword = process.env.ADMIN_PASSWORD;
          if (
            devEmail &&
            devPassword &&
            creds.email.toLowerCase() === devEmail.toLowerCase() &&
            creds.password === devPassword
          ) {
            return {
              id: 'dev-admin',
              email: devEmail,
              name: process.env.ADMIN_NAME ?? 'Admin',
            };
          }
          return null;
        }

        await dbConnect();
        const user = await AdminUser.findOne({ email: creds.email.toLowerCase() }).lean();
        if (!user) return null;
        const ok = await bcrypt.compare(creds.password, user.passwordHash);
        if (!ok) return null;
        return { id: String(user._id), email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id: string }).id;
        token.role = 'admin';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string | undefined;
        (session.user as { role?: string }).role = (token.role as string | undefined) ?? 'admin';
      }
      return session;
    },
  },
};
