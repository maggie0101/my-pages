"use client";

import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

import useQuest from "@/hooks/useQuest";

export default function QuestHeatMap({ userId }: { userId: string }) {
  const { quests } = useQuest({ userId: userId });

  const heatCountMap = quests.reduce(
    (p, c) => {
      // I have no idea what this is, but for deployment, I added this line
      if (!c.doneAt) return p;
      const date = new Date(c.doneAt).toISOString().split("T")[0];
      if (!Object.hasOwn(p, date)) {
        p[date] = 0;
      }
      p[date]++;
      return p;
    },
    {} as Record<string, number>,
  );

  const heatCountRecord = Object.entries(heatCountMap).map((value) => {
    return {
      date: value[0],
      count: value[1],
    };
  });

  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  return (
    <div className="w-full px-3 py-8">
      <CalendarHeatmap
        startDate={oneYearAgo}
        endDate={today}
        values={heatCountRecord}
      ></CalendarHeatmap>
    </div>
  );
}
