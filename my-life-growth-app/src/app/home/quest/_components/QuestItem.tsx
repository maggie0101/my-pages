"use client";

import React, { useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import useGameUser from "@/hooks/useGameUser";
import useQuest from "@/hooks/useQuest";
import useQuestTemplate from "@/hooks/useQuestTemplate";
import type { Quest } from "@/lib/types/db";

import DoneQuestDialog from "./DoneQuestDialog";

type QuestItemProps = {
  userId: string;
  quest: Quest;
  gameUserExperience: number;
  gameUserHealthPoint: number;
  gameUserAttackPoint: number;
  gameUserMoney: number;
};

export default function QuestItem({
  userId,
  quest,
  gameUserExperience,
  gameUserHealthPoint,
  gameUserAttackPoint,
  gameUserMoney,
}: QuestItemProps) {
  const { putQuestTemplate, loading } = useQuestTemplate();
  const { putQuest } = useQuest({ userId });
  const { putGameUser } = useGameUser();
  const [done, setDone] = useState(quest.done);
  const [doneQuestDialogOpen, setDoneQuestDialogOpen] = useState(false);

  const handleFinishQuest = async () => {
    if (!quest.id) return;
    if (done) return;

    try {
      await putQuest({
        id: quest.quest_template_id,
        done: true,
      });
      await putGameUser({
        userId: userId,
        experience: gameUserExperience + quest.level * 2,
        healthPoint: gameUserHealthPoint,
        attackPoint: gameUserAttackPoint,
        money: gameUserMoney + quest.level * 10,
      });
      setDone(true);
      setDoneQuestDialogOpen(true);
    } catch (e) {
      console.error(e);
      alert("Error finishing quest");
    }
  };

  const handleDeleteQuestTemplate = async () => {
    if (!quest.quest_template_id) return;

    try {
      await putQuestTemplate({
        id: quest.quest_template_id,
        enable: false,
      });
    } catch (e) {
      console.error(e);
      alert("Error deleting questTemplate");
    }
  };

  return (
    <>
      <tr>
        <th className="bg-blueGray-50 text-blueGray-500 border-blueGray-100 whitespace-nowrap border border-l-0 border-r-0 border-solid px-6 py-3 text-left align-middle text-xs font-semibold uppercase">
          <Checkbox checked={quest.done ?? false} onClick={handleFinishQuest} />
        </th>
        <th className="bg-blueGray-50 text-blueGray-500 border-blueGray-100 whitespace-nowrap border border-l-0 border-r-0 border-solid px-6 py-3 text-left align-middle text-xs font-semibold uppercase">
          {quest.title}
        </th>
        <td className="bg-blueGray-50 text-blueGray-500 border-blueGray-100 whitespace-nowrap border border-l-0 border-r-0 border-solid px-6 py-3 text-left align-middle text-xs font-semibold uppercase">
          難度 {quest.level}
        </td>
        <td className="bg-blueGray-50 text-blueGray-500 border-blueGray-100 whitespace-nowrap border border-l-0 border-r-0 border-solid px-6 py-3 text-left align-middle text-xs font-semibold uppercase">
          <button
            disabled={loading}
            className="mb-1 mr-1 rounded bg-indigo-500 bg-opacity-90 px-3 py-1 text-xs font-bold uppercase text-white outline-none focus:outline-none active:bg-indigo-600"
            type="button"
            style={{ transition: "all .15s ease" }}
            onClick={handleDeleteQuestTemplate}
          >
            刪除
          </button>
        </td>
      </tr>
      {doneQuestDialogOpen ? (
        <DoneQuestDialog
          setDoneQuestDialogOpen={setDoneQuestDialogOpen}
          questTitle={quest.title}
          questDifficulty={quest.level}
        />
      ) : null}
    </>
  );
}
