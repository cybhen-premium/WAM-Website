import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
// Note: In a real app, use bcrypt to compare passwords.
// For now, I'll assume passwords are plain text for simplicity or handled securely later.

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Login attempt for:", credentials?.email);
        if (!credentials?.email || !credentials?.password) return null;

        // Hardcoded check for debugging
        if (credentials.email === "admin@worldarkmissions.org" && credentials.password === "admin123") {
          console.log("Hardcoded login successful");
          return { id: "1", name: "Admin", email: "admin@worldarkmissions.org" };
        }

        const [user] = await db.select().from(users).where(eq(users.email, credentials.email as string));

        if (!user) {
          console.log("User not found in database:", credentials.email);
          return null;
        }

        console.log("User found, comparing passwords...");
        const isPasswordCorrect = credentials.password === user.password;
        
        if (isPasswordCorrect) {
          console.log("Password correct for:", user.email);
          return { id: String(user.id), name: user.name, email: user.email };
        }

        console.log("Password mismatch for:", user.email);
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      if (isOnAdmin) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      return true;
    },
  },
});
