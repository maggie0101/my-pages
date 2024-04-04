import type { Status } from "@/hooks/useGame";

export default function NextRoundSign({ draw }: { draw: () => Status }) {
  return (
    <div className="absolute right-0 mr-5 mt-16 flex h-12 w-24 items-center rounded-full bg-slate-500 shadow-2xl hover:bg-slate-200">
      <button
        className="h-full w-full focus:outline-none"
        onClick={() => draw()}
      >
        <div className="text-bold text-center text-white hover:text-slate-800">
          結束回合
        </div>
      </button>
    </div>
  );
}
