import { convexClient, api } from "@/lib/convexClient";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await convexClient.mutation(api.seed.seedSampleListings, {});

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error seeding listings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to seed listings" },
      { status: 500 }
    );
  }
}
