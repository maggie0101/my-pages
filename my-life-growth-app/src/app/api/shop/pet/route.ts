import { type NextRequest, NextResponse } from "next/server";

import type { z } from "zod";

import { db } from "@/db";
import { usersToPetsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { buyShopPetRequestSchema } from "@/validators/shop";

type BuyShopPetRequest = z.infer<typeof buyShopPetRequestSchema>;

export async function POST(request: NextRequest) {
  const data = await request.json();

  try {
    buyShopPetRequestSchema.parse(data);
  } catch (error) {
    return NextResponse.json({ error: "Invalid Request" }, { status: 400 });
  }

  const { petId } = data as BuyShopPetRequest;

  try {
    const session = await auth();
    if (!session || !session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    await db
      .insert(usersToPetsTable)
      .values({ userId: userId, petId: petId })
      .execute();

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
