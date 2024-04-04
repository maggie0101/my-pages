import { type NextRequest, NextResponse } from "next/server";

import type { z } from "zod";

import { db } from "@/db";
import { usersToPlantsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { buyShopPlantRequestSchema } from "@/validators/shop";

type BuyShopPlantRequest = z.infer<typeof buyShopPlantRequestSchema>;

export async function POST(request: NextRequest) {
  const data = await request.json();

  try {
    buyShopPlantRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
  }

  const { plantId } = data as BuyShopPlantRequest;

  try {
    const session = await auth();
    if (!session || !session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    await db
      .insert(usersToPlantsTable)
      .values({ userId: userId, plantId: plantId })
      .execute();

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
