"use client";

import React from "react";

type DoneQuestDialogProps = {
  setDoneQuestDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  questTitle: string;
  questDifficulty: number;
};

export default function DoneQuestDialog({
  setDoneQuestDialogOpen,
  questTitle,
  questDifficulty,
}: DoneQuestDialogProps) {
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
        <div className="relative mx-auto my-6 h-60 w-1/3 max-w-3xl ">
          {/*content*/}
          <div
            className="relative flex w-full flex-col rounded-lg border-0  shadow-lg outline-none focus:outline-none"
            style={{
              backgroundImage: "url('https://i.imgur.com/xeW3J71.jpg')",
            }}
          >
            {/*header*/}
            <div className="flex items-start justify-center rounded-t border-b border-solid border-slate-300 p-5">
              <h3 className="text-3xl font-semibold">完成任務 {questTitle}</h3>
            </div>
            {/*body*/}
            <div className="relative flex-auto p-6 ">
              <div className="mb-4 flex items-center justify-center ">
                <h4 className="text-xl font-semibold">
                  經驗+{questDifficulty * 2}
                </h4>
              </div>
              <div className="mb-4 flex items-center justify-center">
                <h4 className="text-xl font-semibold">
                  金錢+{questDifficulty * 10}
                </h4>
              </div>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-center rounded-b border-t border-solid border-slate-300 p-6">
              <button
                className="mb-1 mr-1 w-full rounded bg-emerald-500/80 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-700"
                type="button"
                onClick={() => setDoneQuestDialogOpen(false)}
              >
                確認
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
    </>
  );
}
