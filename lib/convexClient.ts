import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

// Create a Convex client for server-side usage
// Use the deployment URL from environment variables or the provided URL
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "https://calm-hare-453.convex.cloud";

if (!CONVEX_URL) {
  throw new Error("Missing NEXT_PUBLIC_CONVEX_URL environment variable");
}

export const convexClient = new ConvexHttpClient(CONVEX_URL);

export { api };

