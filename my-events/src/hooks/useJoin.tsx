import { useState } from "react";

import { useRouter } from "next/navigation";

export default function useJoin() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const joinActivity = async ({
    activityId,
    userName,
  }: {
    activityId: number;
    userName: string;
  }) => {
    if (loading) return;
    setLoading(true);

    const res = await fetch("/api/joins", {
      method: "POST",
      body: JSON.stringify({
        activityId,
        userName,
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error);
    }

    router.refresh();
    setLoading(false);
  };

  const unJoinActivity = async ({
    activityId,
    userName,
  }: {
    activityId: number;
    userName: string;
  }) => {
    if (loading) return;

    setLoading(true);
    const res = await fetch("/api/joins", {
      method: "DELETE",
      body: JSON.stringify({
        activityId,
        userName,
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
    joinActivity,
    unJoinActivity,
    loading,
  };
}
