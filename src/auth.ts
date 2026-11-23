import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "921b777a83d6a0cfd2c884cb9547d7a86f91d5792ecf696eb8ad5f5bbccdc92b",
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Hardcoded admin credential check for immediate access
        if (credentials.email === "admin@worldarkmissions.org" && credentials.password === "admin123") {
          return { id: "1", name: "Administrator", email: "admin@worldarkmissions.org" };
        }

        try {
          const [user] = await db.select().from(users).where(eq(users.email, credentials.email as string));

          if (!user) return null;

          const isPasswordCorrect = credentials.password === user.password;
          
          if (isPasswordCorrect) {
            return { id: String(user.id), name: user.name, email: user.email };
          }

          return null;
        } catch (dbError) {
          console.warn("Database unavailable during login check, fallback to null:", dbError);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const pathname = request?.nextUrl?.pathname;

      // When called from Server Components or API routes (not Edge proxy/middleware),
      // request.nextUrl is undefined: safely return whether user is authenticated
      if (!pathname) {
        return isLoggedIn;
      }

      const isLoginPage = pathname === "/admin/login";
      const isOnAdmin = pathname.startsWith("/admin");

      if (isLoginPage) {
        if (isLoggedIn) return Response.redirect(new URL("/admin/dashboard", request.nextUrl));
        return true;
      }

      if (isOnAdmin) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }

      return true;
    },
  },
});
