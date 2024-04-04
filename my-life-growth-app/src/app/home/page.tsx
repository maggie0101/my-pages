import { eq } from "drizzle-orm";

import { db } from "@/db";
import {
  gameUsersTable,
  itemsTable,
  petsTable,
  plantsTable,
  usersToItemsTable,
  usersToPetsTable,
  usersToPlantsTable,
} from "@/db/schema";
import useGameUserData from "@/hooks/useGameUserData";
import { auth } from "@/lib/auth";

import GameAvatar from "./_components/GameAvatar";
import ImageList from "./_components/ImageList";
import QuestHeatMap from "./_components/QuestHeatMap";
import Status from "./_components/Status";

export default async function ProfilePage() {
  const session = await auth();
  const id = session?.user?.id ?? "";
  const { getLevelByExperience, countCurrentStatus } = useGameUserData();
  // TODO(gcchen): handle user is undefined
  const [user] = await db
    .select({
      id: gameUsersTable.id,
      userId: gameUsersTable.userId,
      character: gameUsersTable.character,
      experience: gameUsersTable.experience,
      healthPoint: gameUsersTable.healthPoint,
      attackPoint: gameUsersTable.attackPoint,
      money: gameUsersTable.money,
    })
    .from(gameUsersTable)
    .where(eq(gameUsersTable.userId, id));

  const plants = await db
    .select({
      id: plantsTable.id,
      imageUrl: plantsTable.imageUrl,
      name: plantsTable.name,
    })
    .from(usersToPlantsTable)
    .where(eq(usersToPlantsTable.userId, user.userId))
    .leftJoin(plantsTable, eq(usersToPlantsTable.plantId, plantsTable.id));

  const plantItems = plants.map((plant) => ({
    id: plant.id!,
    name: plant.name!,
    url: plant.imageUrl!,
  }));

  const pets = await db
    .select({
      id: petsTable.id,
      imageUrl: petsTable.imageUrl,
      name: petsTable.name,
    })
    .from(usersToPetsTable)
    .where(eq(usersToPetsTable.userId, user.userId))
    .leftJoin(petsTable, eq(usersToPetsTable.petId, petsTable.id));

  const petItems = pets.map((pet) => ({
    id: pet.id!,
    name: pet.name!,
    url: pet.imageUrl!,
  }));

  const items = await db
    .select({
      id: itemsTable.id,
      imageUrl: itemsTable.imageUrl,
      name: itemsTable.name,
      attackBuff: itemsTable.attackBuff,
      healthBuff: itemsTable.healthBuff,
      moneyBuff: itemsTable.moneyBuff,
      price: itemsTable.price,
    })
    .from(usersToItemsTable)
    .where(eq(usersToItemsTable.userId, user.userId))
    .leftJoin(itemsTable, eq(usersToItemsTable.itemId, itemsTable.id));

  const itemItems = items.map((item) => ({
    id: item.id!,
    name: item.name!,
    url: item.imageUrl!,
  }));

  const { level, experience } = getLevelByExperience({
    experience: user.experience ?? 0,
  });
  const { health, attack } = countCurrentStatus({
    gameUser: user,
    items: items,
  });

  return (
    <div
      className="flex h-screen w-full flex-col"
      style={{
        backgroundImage: "url('https://i.imgur.com/cFivuBv.jpg')",
      }}
    >
      <div className="flex h-[35%] flex-row items-end ">
        <div className="ml-6 aspect-square">
          <GameAvatar character={user.character} />
        </div>
        <div className="grow">
          <Status
            name={session?.user?.username ?? "未知"}
            level={level}
            attackPoint={attack}
            healthPoint={health}
            remainExperience={experience}
            money={user.money!}
          />
        </div>
      </div>
      <div className="flex h-[25%] flex-row ">
        <div className="grow">
          <QuestHeatMap userId={user.userId} />
        </div>
      </div>
      <div className="m-8 flex h-[5%] flex-row justify-center text-xl font-bold">
        我擁有的
      </div>
      <div className="flex h-[35%] flex-row overflow-x-scroll">
        <div>
          <ImageList
            items={[...plantItems, ...petItems, ...itemItems]}
          ></ImageList>
        </div>
        {/* <div className="w-1/3">
          <ImageList items={petItems}></ImageList>
        </div>
        <div className="w-1/3">
          <ImageList items={itemItems}></ImageList>
        </div> */}
      </div>
    </div>
  );
}
