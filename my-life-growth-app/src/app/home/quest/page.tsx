import React from "react";

import { eq, and } from "drizzle-orm";

import { db } from "@/db";
import { questTemplatesTable, gameUsersTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import type { Quest } from "@/lib/types/db";

import QuestList from "./_components/QuestList";

export default async function Home() {
  const session = await auth();
  const userId = session?.user?.id ?? "";
  const gameUser = await db.query.gameUsersTable.findFirst({
    where: eq(gameUsersTable.userId, userId),
    columns: {
      id: true,
      experience: true,
      healthPoint: true,
      attackPoint: true,
      money: true,
    },
  });
  const dailyQuestsTemplates = await db.query.questTemplatesTable.findMany({
    where: and(
      and(
        eq(questTemplatesTable.createdBy, userId),
        eq(questTemplatesTable.type, "daily"),
      ),
      eq(questTemplatesTable.enable, true),
    ),
    with: {
      quests: {
        orderBy: (quests, { desc }) => [desc(quests.createdAt)],
        limit: 1,
        columns: {
          id: true,
          done: true,
          doneAt: true,
          createdAt: true,
        },
      },
    },
  });

  const weeklyQuestsTemplates = await db.query.questTemplatesTable.findMany({
    where: and(
      and(
        eq(questTemplatesTable.createdBy, userId),
        eq(questTemplatesTable.type, "weekly"),
      ),
      eq(questTemplatesTable.enable, true),
    ),
    with: {
      quests: {
        orderBy: (quests, { desc }) => [desc(quests.createdAt)],
        limit: 1,
        columns: {
          id: true,
          done: true,
          doneAt: true,
          createdAt: true,
        },
      },
    },
  });

  const dailyQuests: Quest[] = dailyQuestsTemplates.map((questsTemplate) => ({
    id: questsTemplate.quests[0]?.id,
    quest_template_id: questsTemplate.id,
    game_user_id: userId,
    title: questsTemplate.title,
    level: questsTemplate.level,
    type: questsTemplate.type,
    createdAt: questsTemplate.quests[0]?.createdAt,
    done: questsTemplate.quests[0]?.done,
    doneAt: questsTemplate.quests[0]?.doneAt,
  }));

  const weeklyQuests: Quest[] = weeklyQuestsTemplates.map((questsTemplate) => ({
    id: questsTemplate.quests[0]?.id,
    quest_template_id: questsTemplate.id,
    game_user_id: userId,
    title: questsTemplate.title,
    level: questsTemplate.level,
    type: questsTemplate.type,
    createdAt: questsTemplate.quests[0]?.createdAt,
    done: questsTemplate.quests[0]?.done,
    doneAt: questsTemplate.quests[0]?.doneAt,
  }));

  let totalExperienceToday = 0;
  let totalExperienceThisWeek = 0;
  let totalDoneToday = 0;
  let totalDoneThisWeek = 0;

  dailyQuests.forEach((quest) => {
    if (quest.done) {
      totalExperienceToday += quest.level * 2;
      totalDoneToday++;
    }
  });

  weeklyQuests.forEach((quest) => {
    if (quest.done) {
      totalExperienceThisWeek += quest.level * 2;
      totalDoneThisWeek++;
    }
  });

  return (
    <div className="flex h-screen w-full flex-col overflow-y-scroll">
      <div className="flex-1">
        <QuestList
          userId={userId}
          title="主線任務"
          totalExperience={totalExperienceToday}
          type={"daily"}
          quests={dailyQuests}
          gameUserExperience={gameUser?.experience ?? 0}
          gameUserHealthPoint={gameUser?.healthPoint ?? 0}
          gameUserAttackPoint={gameUser?.attackPoint ?? 0}
          gameUserMoney={gameUser?.money ?? 0}
          donePercentage={
            dailyQuests.length === 0
              ? 0
              : (totalDoneToday / dailyQuests.length) * 100
          }
        />
      </div>
      <div className="flex-1">
        <QuestList
          userId={userId}
          title="支線任務"
          totalExperience={totalExperienceThisWeek}
          type={"weekly"}
          quests={weeklyQuests}
          gameUserExperience={gameUser?.experience ?? 0}
          gameUserHealthPoint={gameUser?.healthPoint ?? 0}
          gameUserAttackPoint={gameUser?.attackPoint ?? 0}
          gameUserMoney={gameUser?.money ?? 0}
          donePercentage={
            weeklyQuests.length === 0
              ? 0
              : (totalDoneThisWeek / weeklyQuests.length) * 100
          }
        />
      </div>
    </div>
  );
}
