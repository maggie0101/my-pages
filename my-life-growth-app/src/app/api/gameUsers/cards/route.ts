import { NextResponse, type NextRequest } from "next/server";

import type { z } from "zod";

import { db } from "@/db";
import { usersToCardsTable } from "@/db/schema";
import { postGameUsersCardsRequestSchema } from "@/validators/gameUsersCards";

type PostGameUsersCardsRequest = z.infer<
  typeof postGameUsersCardsRequestSchema
>;

export async function POST(request: NextRequest) {
  const data = await request.json();

  try {
    postGameUsersCardsRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { cardId, userId } = data as PostGameUsersCardsRequest;

  try {
    await db
      .insert(usersToCardsTable)
      .values({
        cardId,
        userId,
      })
      .execute();
    return NextResponse.json("OK", { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
