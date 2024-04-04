"use client";

import type { characterEnumType } from "@/db/schema";

/* eslint-disable @next/next/no-img-element */

type GameAvatarProps = {
  character: characterEnumType;
};

export default function GameAvatar({ character }: GameAvatarProps) {
  const characterImgUrl: Record<characterEnumType, string> = {
    health: "https://i.imgur.com/BEBEufO.png",
    hobby: "https://i.imgur.com/qukqXGo.png",
    study: "https://i.imgur.com/ZnsS0Ug.png",
    work: "https://i.imgur.com/iikfCy5.png",
  };
  return (
    <div className="rounded-xl  border-4 border-slate-300">
      <img
        src={characterImgUrl[character]}
        alt="user avatar"
        className="h-48 w-48"
      />
    </div>
  );
}
