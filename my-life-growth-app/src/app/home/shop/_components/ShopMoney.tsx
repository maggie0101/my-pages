import { redirect } from "next/navigation";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { gameUsersTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { publicEnv } from "@/lib/env/public";

export default async function ShopMoney() {
  const session = await auth();
  if (!session || !session?.user?.id) {
    redirect(publicEnv.NEXT_PUBLIC_BASE_URL);
  }

  const userId = session.user.id;
  const gameUser = await db.query.gameUsersTable.findFirst({
    where: eq(gameUsersTable.userId, userId),
  });

  return (
    <div className="flex ">
      <div className="flex justify-center overflow-hidden rounded-xl border-2 border-purple-700 border-opacity-20">
        <div className="flex justify-center rounded-lg bg-orange-200 bg-opacity-50 text-xl">
          💰
        </div>
        <div className="bg-slate-100 p-1 text-center text-xl">
          {gameUser?.money}
        </div>
      </div>
    </div>
  );
}
