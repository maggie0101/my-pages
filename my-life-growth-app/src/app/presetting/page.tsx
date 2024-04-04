import { redirect } from "next/navigation";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { gameUsersTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { publicEnv } from "@/lib/env/public";

import TotalSetting from "./_components/total_setting";

export default async function Home() {
  const session = await auth();
  if (!session || !session?.user?.id) {
    redirect(publicEnv.NEXT_PUBLIC_BASE_URL);
  }
  const userId = session.user.id;

  const existedUser = await db.query.gameUsersTable.findFirst({
    where: eq(gameUsersTable.userId, userId),
  });
  return existedUser ? (
    redirect(`${publicEnv.NEXT_PUBLIC_BASE_URL}/home`)
  ) : (
    <TotalSetting userId={userId} />
  );
}
