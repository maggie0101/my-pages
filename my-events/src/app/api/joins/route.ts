import { NextResponse, type NextRequest } from "next/server";

import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { joinsTable } from "@/db/schema";

const joinActivityRequestSchema = z.object({
  activityId: z.number().positive(),
  userName: z.string().min(1).max(50),
});

type joinActivityRequest = z.infer<typeof joinActivityRequestSchema>;

export async function GET(request: NextRequest) {
  const data = await request.json();

  try {
    joinActivityRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { activityId, userName } = data as joinActivityRequest;

  try {
    
    const [exist] = await db
      .select({ dummy: sql`1` })
      .from(joinsTable)
      .where(
        and(
          eq(joinsTable.activityId, activityId),
          eq(joinsTable.userName, userName),
        ),
      )
      .execute();


    return NextResponse.json({ joined: Boolean(exist) }, { status: 200 });
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
    joinActivityRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { activityId, userName } = data as joinActivityRequest;

  try {
    await db
      .insert(joinsTable)
      .values({
        activityId,
        userName,
      })
      .onConflictDoNothing()
      .execute();
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }

  return new NextResponse("OK", { status: 200 });
}

export async function DELETE(request: NextRequest) {
  const data = await request.json();

  try {
    joinActivityRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { activityId, userName } = data as joinActivityRequest;

  try {
    await db
      .delete(joinsTable)
      .where(
        and(
          eq(joinsTable.activityId, activityId),
          eq(joinsTable.userName, userName),
        ),
      )
      .execute();
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }

  return new NextResponse("OK", { status: 200 });
}
