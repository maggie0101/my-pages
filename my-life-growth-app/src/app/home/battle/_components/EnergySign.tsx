export default function EnergySign({
  current,
  max,
}: {
  current: number;
  max: number;
}) {
  return (
    <div className="relative ml-5 mt-10 flex h-24 w-24 items-center justify-center rounded-full bg-slate-500 text-xl font-bold text-white shadow-2xl">
      {current}/{max}
    </div>
  );
}
