export default function Money({ money }: { money: number }) {
  return (
    <div className="width:auto text-md flex h-16 flex-col items-center  justify-center rounded-xl border-2 border-slate-300 border-opacity-75 bg-purple-100 bg-opacity-60 text-center font-semibold">
      <div className="p-px font-semibold  ">💰</div>
      <h1 className="border-t-2 border-slate-300 border-opacity-75 px-2 font-semibold">
        {money}
      </h1>
    </div>
  );
}
