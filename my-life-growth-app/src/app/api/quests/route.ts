import { NextResponse, type NextRequest } from "next/server";

import { eq } from "drizzle-orm";
import { type z } from "zod";

import { db } from "@/db";
import { questsTable } from "@/db/schema";
import {
  postQuestsRequestSchema,
  putQuestRequestSchema,
} from "@/validators/quests";

type PostQuestsRequest = z.infer<typeof postQuestsRequestSchema>;
type PutQuestRequest = z.infer<typeof putQuestRequestSchema>;

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");

  if (userId === null) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const quests = await db
      .select({
        id: questsTable.id,
        gameUserId: questsTable.game_user_id,
        createdAt: questsTable.createdAt,
        doneAt: questsTable.doneAt,
        done: questsTable.done,
        questTemplateId: questsTable.quest_template_id,
      })
      .from(questsTable)
      .where(eq(questsTable.game_user_id, userId))
      .orderBy(questsTable.doneAt)
      .execute();
    return NextResponse.json({ quests }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const data = await request.json();

  try {
    postQuestsRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { quest_template_id, game_user_id, title, level, type } =
    data as PostQuestsRequest;

  try {
    await db
      .insert(questsTable)
      .values({
        quest_template_id: quest_template_id,
        game_user_id: game_user_id,
        title: title,
        level: level,
        type: type,
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
    putQuestRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { id, done, doneAt } = data as PutQuestRequest;

  try {
    await db
      .update(questsTable)
      .set({
        done,
        doneAt: new Date(doneAt),
      })
      .where(eq(questsTable.id, id))
      .execute();
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }

  return new NextResponse("OK", { status: 200 });
}
