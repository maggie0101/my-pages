import React from "react";

type ProgressBarProps = {
  percentage: number;
};

export default function ProgressBar({ percentage }: ProgressBarProps) {
  return (
    <div className="relative pt-1">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <span
            className={`inline-block rounded-full px-2 py-1 text-xs font-semibold uppercase ${
              percentage === 100
                ? "bg-green-200 text-green-600"
                : "bg-purple-200 text-purple-600"
            }`}
          >
            {percentage === 100 ? "Task done" : "Task in progress"}
          </span>
        </div>
        <div className="text-right">
          <span
            className={`inline-block text-xs font-semibold ${
              percentage === 100 ? "text-green-600" : "text-purple-600"
            }`}
          >
            {percentage.toFixed().toString()}%
          </span>
        </div>
      </div>
      <div
        className={`mb-4 flex h-2 overflow-hidden rounded text-xs ${
          percentage === 100 ? "bg-green-200" : "bg-purple-200"
        }`}
      >
        <div
          style={{ width: `${percentage.toFixed().toString()}%` }}
          className={`flex flex-col justify-center whitespace-nowrap text-center text-white shadow-none ${
            percentage === 100
              ? "bg-green-500 bg-opacity-50"
              : "bg-purple-500 bg-opacity-70"
          }`}
        ></div>
      </div>
    </div>
  );
}
