import { NextResponse, type NextRequest } from "next/server";

import { eq } from "drizzle-orm";
import type { z } from "zod";

import { db } from "@/db";
import { gameUsersTable } from "@/db/schema";
import {
  postGameUsersRequestSchema,
  putGameUsersRequestSchema,
} from "@/validators/gameUsers";

type PostGameUsersRequest = z.infer<typeof postGameUsersRequestSchema>;
type PutGameUsersRequest = z.infer<typeof putGameUsersRequestSchema>;

export async function POST(request: NextRequest) {
  const data = await request.json();

  try {
    postGameUsersRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { userId, character, experience, healthPoint, attackPoint, money } =
    data as PostGameUsersRequest;

  try {
    await db
      .insert(gameUsersTable)
      .values({
        userId: userId,
        character: character,
        experience: experience,
        healthPoint: healthPoint,
        attackPoint: attackPoint,
        money: money,
      })
      .execute();
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
  return new NextResponse("OK", { status: 200 });
}

export async function PUT(request: NextRequest) {
  const data = await request.json();

  try {
    putGameUsersRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { userId, experience, healthPoint, attackPoint, money } =
    data as PutGameUsersRequest;

  if (experience < 0 || healthPoint < 0 || attackPoint < 0 || money < 0) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    await db
      .update(gameUsersTable)
      .set({
        experience: experience,
        healthPoint: healthPoint,
        attackPoint: attackPoint,
        money: money,
      })
      .where(eq(gameUsersTable.userId, userId))
      .execute();
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }

  return new NextResponse("OK", { status: 200 });
}
