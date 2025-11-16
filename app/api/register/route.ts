import { convexClient, api } from "@/lib/convexClient";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, name, password } = body;

  const hashedPassword = await bcrypt.hash(password, 12);

  const userId = await convexClient.mutation(api.users.createUser, {
    email,
    name,
    hashedPassword,
  });

  const user = await convexClient.query(api.users.getUserById, {
    userId,
  });

  return NextResponse.json(user);
}
