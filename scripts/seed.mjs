import { ConvexHttpClient } from "convex/browser";

const CONVEX_URL = "https://calm-hare-453.convex.cloud";
const client = new ConvexHttpClient(CONVEX_URL);

async function seed() {
  try {
    console.log("🌱 Seeding sample listings...");

    const result = await client.mutation("seed:seedSampleListings", {});

    console.log("✅ Success:", result.message);
    if (result.listingIds) {
      console.log(`📝 Created ${result.listingIds.length} listings`);
    }
  } catch (error) {
    console.error("❌ Error seeding database:", error.message);
    process.exit(1);
  }
}

seed();
