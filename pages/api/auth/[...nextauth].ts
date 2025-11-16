import { convexClient, api } from "@/lib/convexClient";
import bcrypt from "bcrypt";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import { Id } from "@/convex/_generated/dataModel";

export const authOptions: AuthOptions = {
  providers: [
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID as string,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    // }),
    // FacebookProvider({
    //   clientId: process.env.FACEBOOK_ID as string,
    //   clientSecret: process.env.FACEBOOK_SECRET as string,
    // }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await convexClient.query(api.users.getUserByEmail, {
          email: credentials.email,
        });

        if (!user || !user?.hashedPassword) {
          throw new Error("Invalid credentials");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );
        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }
        
        return {
          id: user._id,
          email: user.email || undefined,
          name: user.name || undefined,
          image: user.image || undefined,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // OAuth providers commented out for now
      // if (account?.provider === "google" || account?.provider === "facebook") {
      //   try {
      //     // Check if user exists
      //     let dbUser = null;
      //     if (user.email) {
      //       dbUser = await convexClient.query(api.users.getUserByEmail, {
      //         email: user.email,
      //       });
      //     }

      //     // Create user if doesn't exist
      //     if (!dbUser) {
      //       const userId = await convexClient.mutation(api.users.createUser, {
      //         email: user.email || undefined,
      //         name: user.name || undefined,
      //         image: user.image || undefined,
      //       });
      //       dbUser = await convexClient.query(api.users.getUserById, {
      //         userId,
      //       });
      //     } else {
      //       // Update user info if needed
      //       await convexClient.mutation(api.users.updateUser, {
      //         userId: dbUser._id as Id<"users">,
      //         name: user.name || dbUser.name,
      //         image: user.image || dbUser.image,
      //       });
      //     }

      //     // Store account info if needed (for OAuth providers)
      //     if (account && dbUser) {
      //       // You might want to create an account record here
      //       // For now, we'll just ensure the user exists
      //     }
      //   } catch (error) {
      //     console.error("Error in signIn callback:", error);
      //     return false;
      //   }
      // }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
