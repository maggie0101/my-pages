import { NextResponse, type NextRequest } from "next/server";

import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { questTemplatesTable } from "@/db/schema";
import { publicEnv } from "@/lib/env/public";

export async function GET(request: NextRequest) {
  const cron = request.nextUrl.pathname.split("/")[3];
  if (!cron) return new Response("No cron provided", { status: 400 });

  try {
    const questTemplates = await db.query.questTemplatesTable.findMany({
      where: and(
        eq(questTemplatesTable.type, "daily"),
        eq(questTemplatesTable.enable, true),
      ),
      columns: {
        id: true,
        createdBy: true,
        title: true,
        level: true,
        type: true,
      },
    });

    for (const questTemplate of questTemplates) {
      const res = await fetch(`${publicEnv.NEXT_PUBLIC_BASE_URL}api/quests`, {
        method: "POST",
        body: JSON.stringify({
          quest_template_id: questTemplate.id,
          game_user_id: questTemplate.createdBy,
          title: questTemplate.title,
          level: questTemplate.level,
          type: questTemplate.type,
        }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error);
      }
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }

  return new NextResponse("OK", { status: 200 });
}
