import React from "react";

type HealthBarProps = {
  remainingHealth: number;
  health: number;
};

export default function HealthBar({ remainingHealth, health }: HealthBarProps) {
  return (
    <div className="relative flex items-end justify-center pt-1">
      <div className="mb-4 flex h-2 w-[75%] items-center overflow-hidden rounded bg-slate-200 text-xs">
        <div
          // style={{ width: `${remainingHealth/health}%` }}
          style={{ width: `${(remainingHealth * 100) / health}%` }}
          className="flex flex-col justify-center whitespace-nowrap bg-red-400 text-center text-white shadow-none"
        >
          <span className="inline-block p-14 text-xs font-bold text-red-900">
            {remainingHealth}/{health}
          </span>
        </div>
      </div>
    </div>
  );
}
