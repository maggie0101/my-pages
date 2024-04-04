"use client";

type ProgressProps = {
  percentage: string;
  color?: string;
};

export default function Progress({ percentage, color }: ProgressProps) {
  return (
    <div
      className={`z-10 flex h-2 overflow-hidden rounded border border-slate-300 border-opacity-75 bg-${
        color ?? "purple"
      }-200 text-xs`}
    >
      <div
        style={{ width: `${percentage}%` }}
        className={`z-10 flex flex-col justify-center whitespace-nowrap bg-${
          color ?? "purple"
        }-500 bg-opacity-40 text-center text-white shadow-none`}
      ></div>
    </div>
  );
}
