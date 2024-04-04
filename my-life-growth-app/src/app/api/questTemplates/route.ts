import { NextResponse, type NextRequest } from "next/server";

import { eq } from "drizzle-orm";
import type { z } from "zod";

import { db } from "@/db";
import { questTemplatesTable } from "@/db/schema";
import {
  postQuestTemplateRequestSchema,
  putQuestTemplateRequestSchema,
} from "@/validators/questTemplates";

type PostQuestTemplateRequest = z.infer<typeof postQuestTemplateRequestSchema>;
type PutQuestTemplateRequest = z.infer<typeof putQuestTemplateRequestSchema>;

export async function POST(request: NextRequest) {
  const data = await request.json();

  try {
    postQuestTemplateRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { title, level, createdBy, type } = data as PostQuestTemplateRequest;

  try {
    const [insertedItem] = await db
      .insert(questTemplatesTable)
      .values({
        title: title,
        level: level,
        createdBy: createdBy,
        type: type,
      })
      .returning({ id: questTemplatesTable.id });
    return NextResponse.json({ insertedItem }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  const data = await request.json();

  try {
    putQuestTemplateRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { id, enable } = data as PutQuestTemplateRequest;

  try {
    await db
      .update(questTemplatesTable)
      .set({
        enable: enable,
      })
      .where(eq(questTemplatesTable.id, id))
      .execute();
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }

  return new NextResponse("OK", { status: 200 });
}
