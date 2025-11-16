import { convexClient, api } from "@/lib/convexClient";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { Id } from "@/convex/_generated/dataModel";

export async function getSession() {
  return await getServerSession(authOptions);
}

export default async function getCurrentUser() {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return null;
    }

    const currentUser = await convexClient.query(api.users.getUserByEmail, {
      email: session.user.email as string,
    });

    if (!currentUser) {
      return null;
    }

    return {
      ...currentUser,
      id: currentUser._id,
    };
  } catch (error: any) {
    console.log(
      "🚀 ~ file: getCurrentUser.ts:13 ~ getCurrentUser ~ error:",
      error
    );
    return null;
  }
}
