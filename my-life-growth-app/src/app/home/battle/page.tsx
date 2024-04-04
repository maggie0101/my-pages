import React from "react";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import {
  gameUsersTable,
  usersToCardsTable,
  usersToItemsTable,
} from "@/db/schema";
import { auth } from "@/lib/auth";

import Battle from "./_components/Battle";

export default async function Home() {
  const session = await auth();
  const userId = session?.user?.id ?? "";
  const gameUser = await db.query.gameUsersTable.findFirst({
    where: eq(gameUsersTable.userId, userId),
    columns: {
      id: true,
      character: true,
      userId: true,
      experience: true,
      healthPoint: true,
      attackPoint: true,
      money: true,
    },
  });

  const cards = await db.query.usersToCardsTable.findMany({
    where: eq(usersToCardsTable.userId, userId),
    with: {
      card: {
        columns: {
          name: true,
          attack: true,
          cost: true,
          id: true,
          imageUrl: true,
          shield: true,
        },
      },
    },
  });

  const items = await db.query.usersToItemsTable.findMany({
    where: eq(usersToItemsTable.userId, userId),
    with: {
      item: {
        columns: {
          name: true,
          imageUrl: true,
          attackBuff: true,
          healthBuff: true,
          id: true,
          moneyBuff: true,
          price: true,
        },
      },
    },
  });

  return (
    <Battle
      gameUser={gameUser!}
      cards={cards.map((item) => item.card)}
      items={items.map((item) => item.item)}
    />
  );
}
