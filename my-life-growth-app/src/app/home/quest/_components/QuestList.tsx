"use client";

import React, { useState } from "react";

import Stack from "@mui/material/Stack";
import dayjs from "dayjs";

import type { questTypeEnumType } from "@/db/schema";
import type { Quest } from "@/lib/types/db";

import AddNewQuestDialog from "./AddNewQuestDialog";
import ProgressBar from "./ProgressBar";
import QuestItem from "./QuestItem";

type QuestListProps = {
  userId: string;
  title: string;
  totalExperience: number;
  type: questTypeEnumType;
  quests: Quest[];
  gameUserExperience: number;
  gameUserHealthPoint: number;
  gameUserAttackPoint: number;
  gameUserMoney: number;
  donePercentage: number;
};

export default function QuestList({
  userId,
  title,
  totalExperience,
  type,
  quests,
  gameUserExperience,
  gameUserHealthPoint,
  gameUserAttackPoint,
  gameUserMoney,
  donePercentage,
}: QuestListProps) {
  const [addNewQuestDialogOpen, setAddNewQuestDialogOpen] = useState(false);
  const date = new Date();
  const dayjsDate = dayjs(date);
  const formattedDate = date.toLocaleDateString("zh-TW", {
    month: "2-digit",
    day: "2-digit",
  });

  const todayQuests = quests.filter(
    (quest) =>
      quest.createdAt?.toLocaleDateString("zh-TW", {
        month: "2-digit",
        day: "2-digit",
      }) === formattedDate,
  );

  const thisWeekQuest = quests.filter((quest) =>
    dayjsDate.isSame(quest.createdAt, "week"),
  );

  return (
    <>
      <div className="mt-4 flex grow flex-wrap ">
        <div className="mb-12 grow px-4">
          <div className="relative mb-6 flex w-full min-w-0 flex-col break-words rounded bg-white shadow-lg">
            <div className="mb-0 rounded-t border-0 px-4 py-3">
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ mb: 2 }}
              >
                <div className="flex flex-row">
                  <h3 className="text-blueGray-700 mr-4 text-base font-semibold">
                    {title} {formattedDate}
                  </h3>
                  <button
                    className="mb-1 mr-1 rounded bg-indigo-500 bg-opacity-90 px-3 py-1 text-xs font-bold uppercase text-white outline-none focus:outline-none active:bg-indigo-600"
                    type="button"
                    style={{ transition: "all .15s ease" }}
                  >
                    {type === "daily" ? "本日" : "本週"}總計經驗+
                    {totalExperience}
                  </button>
                </div>
                <button
                  className="mb-1 mr-1 rounded bg-indigo-500 bg-opacity-90 px-3 py-1 text-xs font-bold uppercase text-white outline-none focus:outline-none active:bg-indigo-600"
                  type="button"
                  style={{ transition: "all .15s ease" }}
                  onClick={() => setAddNewQuestDialogOpen(true)}
                >
                  新增{type === "daily" ? "主" : "支"}線任務
                </button>
              </Stack>
              <ProgressBar percentage={donePercentage} />
            </div>
            <div className="block w-full overflow-x-auto">
              <table className="w-full border-collapse items-center bg-transparent">
                <tbody>
                  {type === "daily"
                    ? todayQuests.map((quest, index) => (
                        <QuestItem
                          key={index}
                          userId={userId}
                          quest={quest}
                          gameUserExperience={gameUserExperience}
                          gameUserHealthPoint={gameUserHealthPoint}
                          gameUserAttackPoint={gameUserAttackPoint}
                          gameUserMoney={gameUserMoney}
                        />
                      ))
                    : thisWeekQuest.map((quest, index) => (
                        <QuestItem
                          key={index}
                          userId={userId}
                          quest={quest}
                          gameUserExperience={gameUserExperience}
                          gameUserHealthPoint={gameUserHealthPoint}
                          gameUserAttackPoint={gameUserAttackPoint}
                          gameUserMoney={gameUserMoney}
                        />
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {addNewQuestDialogOpen ? (
        <AddNewQuestDialog
          setAddNewQuestDialogOpen={setAddNewQuestDialogOpen}
          type={type}
        />
      ) : null}
    </>
  );
}
