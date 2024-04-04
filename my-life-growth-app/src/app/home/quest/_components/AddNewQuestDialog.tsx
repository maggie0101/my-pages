"use client";

import React, { useState } from "react";

import { useSession } from "next-auth/react";

import type { questTypeEnumType } from "@/db/schema";
import useQuest from "@/hooks/useQuest";
import useQuestTemplate from "@/hooks/useQuestTemplate";

type addNewQuestDialogProps = {
  setAddNewQuestDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  type: questTypeEnumType;
};

export default function AddNewQuestDialog({
  setAddNewQuestDialogOpen,
  type,
}: addNewQuestDialogProps) {
  const { data: session } = useSession();
  const { postQuestTemplate } = useQuestTemplate();
  const { postQuest, loading } = useQuest({ userId: session?.user?.id ?? "" });
  const [questName, setQuestName] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(
    null,
  );

  const handleAddQuestTemplate = async () => {
    const userId = session?.user?.id;
    if (!userId) return;
    if (!questName) return;
    if (!selectedDifficulty) return;

    try {
      const insertedId = await postQuestTemplate({
        title: questName,
        level: selectedDifficulty,
        createdBy: userId,
        type: type,
      });
      await postQuest({
        quest_template_id: insertedId,
        game_user_id: userId,
        title: questName,
        level: selectedDifficulty,
        type: type,
      });
      setQuestName("");
      setSelectedDifficulty(null);
    } catch (e) {
      console.error(e);
      alert("Error posting quest");
    }
    setAddNewQuestDialogOpen(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
        <div className="relative mx-auto my-6 w-auto max-w-3xl">
          {/*content*/}
          <div
            className="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none"
            style={{
              backgroundImage: "url('https://i.imgur.com/xeW3J71.jpg')",
            }}
          >
            {/*header*/}
            <div className="flex items-start justify-center rounded-t border-b border-solid border-slate-300 p-5">
              <h3 className="text-3xl font-semibold text-slate-600">
                新增{type === "daily" ? "主" : "支"}線任務
              </h3>
            </div>
            {/*body*/}
            <div className="relative flex-auto p-6">
              <div className="mb-4">
                <label
                  htmlFor="questName"
                  className="block text-sm font-medium text-slate-600"
                >
                  任務名稱
                </label>
                <input
                  type="text"
                  id="questName"
                  name="questName"
                  className="mt-1 w-full rounded-md border border-slate-300 p-2"
                  placeholder="輸入任務名稱"
                  value={questName}
                  onChange={(e) => setQuestName(e.target.value)}
                />
              </div>
              <div className="mb-2 block text-sm font-medium text-slate-600">
                請選擇難度:
              </div>
              <div className="mb-4 flex items-center">
                {[1, 2, 3, 4, 5].map((index) => (
                  <button
                    key={index}
                    className={`mr-2 px-4 py-2 text-sm font-bold uppercase focus:outline-none ${
                      selectedDifficulty === index
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-300 text-gray-700"
                    }`}
                    onClick={() => setSelectedDifficulty(index)}
                  >
                    難度{index}
                  </button>
                ))}
              </div>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end rounded-b border-t border-solid border-slate-300 p-6">
              <button
                className="background-transparent mb-1 mr-1 px-6 py-2 text-sm font-bold uppercase text-red-500/70 outline-none transition-all duration-150 ease-linear focus:outline-none"
                type="button"
                onClick={() => setAddNewQuestDialogOpen(false)}
              >
                關閉
              </button>
              <button
                disabled={loading}
                className="mb-1 mr-1 rounded bg-emerald-500/80 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-700"
                type="button"
                onClick={handleAddQuestTemplate}
              >
                新增任務
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
    </>
  );
}
