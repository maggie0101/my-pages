import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import type { Quest } from "@/lib/types/db";

export default function useQuest({ userId }: { userId: string }) {
  const [quests, setQuests] = useState<Quest[]>([]);

  useEffect(() => {
    const fetchQuest = async () => {
      const res = await fetch(`/api/quests/?userId=${userId}`, {
        method: "GET",
      });
      if (!res.ok) {
        return;
      }
      const data: { quests: Quest[] } = await res.json();
      setQuests(data.quests);
    };
    fetchQuest();
  }, [userId]);

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const postQuest = async ({
    quest_template_id,
    game_user_id,
    title,
    level,
    type,
  }: {
    quest_template_id: number;
    game_user_id: string;
    title: string;
    level: number;
    type: "daily" | "weekly";
  }) => {
    setLoading(true);

    const res = await fetch("/api/quests", {
      method: "POST",
      body: JSON.stringify({
        quest_template_id,
        game_user_id,
        title,
        level,
        type,
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }

    router.refresh();
    setLoading(false);
  };

  const putQuest = async ({ id, done }: { id: number; done: boolean }) => {
    setLoading(true);

    const res = await fetch("/api/quests", {
      method: "PUT",
      body: JSON.stringify({
        id: id,
        done: done,
        doneAt: new Date(),
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
    quests,
    postQuest,
    putQuest,
    loading,
  };
}
