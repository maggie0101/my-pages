import { useState } from "react";

import { useRouter } from "next/navigation";

import type { questTypeEnumType } from "@/db/schema";

export default function useQuestTemplate() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const postQuestTemplate = async ({
    title,
    level,
    createdBy,
    type,
  }: {
    title: string;
    level: number;
    createdBy: string;
    type: questTypeEnumType;
  }) => {
    setLoading(true);

    const res = await fetch("/api/questTemplates", {
      method: "POST",
      body: JSON.stringify({
        title,
        level,
        createdBy,
        type,
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }

    const response = await res.json();
    const insertedId = response.insertedItem.id;

    router.refresh();
    setLoading(false);

    return insertedId;
  };

  const putQuestTemplate = async ({
    id,
    enable,
  }: {
    id: number;
    enable: boolean;
  }) => {
    setLoading(true);

    const res = await fetch("/api/questTemplates", {
      method: "PUT",
      body: JSON.stringify({
        id,
        enable,
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
    postQuestTemplate,
    putQuestTemplate,
    loading,
  };
}
