import { useState } from "react";

import { useRouter } from "next/navigation";

import type { characterEnumType } from "@/db/schema";

export default function useGameUser() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const postGameUser = async ({
    userId,
    character,
    experience,
    healthPoint,
    attackPoint,
    money,
  }: {
    userId: string;
    character: characterEnumType;
    experience: number;
    healthPoint: number;
    attackPoint: number;
    money: number;
  }) => {
    setLoading(true);

    const res = await fetch("/api/gameUsers", {
      method: "POST",
      body: JSON.stringify({
        userId,
        character,
        experience,
        healthPoint,
        attackPoint,
        money,
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }

    router.refresh();
    setLoading(false);
  };

  const putGameUser = async ({
    userId,
    experience,
    healthPoint,
    attackPoint,
    money,
  }: {
    userId: string;
    experience: number;
    healthPoint: number;
    attackPoint: number;
    money: number;
  }) => {
    setLoading(true);

    const res = await fetch("/api/gameUsers", {
      method: "PUT",
      body: JSON.stringify({
        userId,
        experience,
        healthPoint,
        attackPoint,
        money,
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }

    router.refresh();
    setLoading(false);
  };

  return {
    postGameUser,
    putGameUser,
    loading,
  };
}
