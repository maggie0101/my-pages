import { type NextRequest, NextResponse } from "next/server";

import type { z } from "zod";

import { db } from "@/db";
import { usersToItemsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { buyShopItemRequestSchema } from "@/validators/shop";

type BuyShopItemRequest = z.infer<typeof buyShopItemRequestSchema>;

export async function POST(request: NextRequest) {
  const data = await request.json();

  try {
    buyShopItemRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
  }

  const { itemId } = data as BuyShopItemRequest;

  try {
    const session = await auth();
    if (!session || !session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    await db
      .insert(usersToItemsTable)
      .values({ userId: userId, itemId: itemId })
      .execute();

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
