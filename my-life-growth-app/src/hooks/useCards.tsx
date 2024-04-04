import { useState } from "react";

import { useRouter } from "next/navigation";

export default function useCards() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const addUserCard = async ({
    cardId,
    userId,
  }: {
    cardId: number;
    userId: string;
  }) => {
    setLoading(true);
    const res = await fetch("/api/gameUsers/cards", {
      method: "POST",
      body: JSON.stringify({ cardId, userId }),
    });
    if (!res.ok) {
      const body = await res.json();
      setLoading(false);
      throw new Error(body.error);
    }
    router.refresh();
    setLoading(false);
  };

  return {
    loading,
    addUserCard,
  };
}
