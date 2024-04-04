"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Button, Dialog } from "@mui/material";

import type { characterEnumType } from "@/db/schema";
import useCards from "@/hooks/useCards";
import useGameUsers from "@/hooks/useGameUser";

import PetSetting from "./petSetting";
import RoleSetting from "./roleSetting";

type TotalSettingProps = {
  userId: string;
};

export default function TotalSetting({ userId }: TotalSettingProps) {
  const [settingDialog, setSettingDialog] = useState(true);
  const [character, setCharacter] = useState<characterEnumType>(
    "study" as const,
  );
  const { postGameUser } = useGameUsers();
  const { addUserCard } = useCards();
  const router = useRouter();

  const handlePresetting = async () => {
    try {
      let health = 0;
      let attack = 0;
      switch (character) {
        case "study":
          health = 50;
          attack = 100;
          break;
        case "health":
          health = 100;
          attack = 50;
          break;
        case "work":
          health = 75;
          attack = 75;
          break;
        case "hobby":
          health = 75;
          attack = 50;
          break;
        default:
          break;
      }
      await postGameUser({
        userId: userId,
        character: character,
        experience: 0,
        healthPoint: health,
        attackPoint: attack,
        money: 100,
      });
      await addUserCard({ cardId: 1, userId: userId });
      await addUserCard({ cardId: 2, userId: userId });
      setSettingDialog(false);
      router.push(`/home`);
    } catch (e) {
      console.log(e);
      alert(e);
    }
  };
  return (
    <Dialog
      open={settingDialog}
      maxWidth="md"
      fullWidth
      style={{
        backgroundImage: "url('https://i.imgur.com/cFivuBv.jpg')",
      }}
    >
      <div className="flex justify-around">
        <RoleSetting setCharacter={setCharacter} />
        <PetSetting />
      </div>
      <div className="border border-slate-400/60"></div>

      <Button
        onClick={handlePresetting}
        className=" rounded-none bg-emerald-600/50 text-white hover:text-emerald-800"
      >
        確定
      </Button>
    </Dialog>
  );
}
