import React from "react";

import { redirect } from "next/navigation";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import {
  gameUsersTable,
  itemsTable,
  petsTable,
  plantsTable,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { publicEnv } from "@/lib/env/public";

import ItemTemplate from "./_components/ItemTemplate";
import PetTemplate from "./_components/PetTemplate";
import PlantTemplate from "./_components/PlantTemplate";

export default async function Home() {
  const session = await auth();
  if (!session || !session?.user?.id) {
    redirect(publicEnv.NEXT_PUBLIC_BASE_URL);
  }

  const userId = session.user.id;
  const gameUser = await db.query.gameUsersTable.findFirst({
    where: eq(gameUsersTable.userId, userId),
  });

  const pets = await db
    .select({
      id: petsTable.id,
      imageUrl: petsTable.imageUrl,
      name: petsTable.name,
      price: petsTable.price,
    })
    .from(petsTable);
  const plants = await db
    .select({
      id: plantsTable.id,
      imageUrl: plantsTable.imageUrl,
      name: plantsTable.name,
      price: plantsTable.price,
    })
    .from(plantsTable);
  const items = await db
    .select({
      id: itemsTable.id,
      imageUrl: itemsTable.imageUrl,
      name: itemsTable.name,
      price: itemsTable.price,
    })
    .from(itemsTable);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 ">
      {pets.map((pet) => (
        <PetTemplate
          key={pet.id}
          id={pet.id}
          name={pet.name}
          image={pet.imageUrl}
          price={pet.price}
          gameUser={gameUser!}
        />
      ))}
      {plants.map((plant) => (
        <PlantTemplate
          key={plant.id}
          id={plant.id}
          name={plant.name}
          image={plant.imageUrl}
          price={plant.price}
          gameUser={gameUser!}
        />
      ))}
      {items.map((item) => (
        <ItemTemplate
          key={item.id}
          id={item.id}
          name={item.name}
          image={item.imageUrl}
          price={item.price}
          gameUser={gameUser!}
        />
      ))}
    </div>
  );
}
