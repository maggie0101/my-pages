import React from "react";

import ShopMoney from "./_components/ShopMoney";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="ml-1/4 flex w-full flex-col"
      style={{
        backgroundImage: "url('https://i.imgur.com/cFivuBv.jpg')",
      }}
    >
      <div className="fixed z-10 flex w-full flex-grow">
        <div className="flex w-[78%] justify-end p-3 ">
          <ShopMoney />
        </div>
        <div className="h-8 bg-slate-300"></div>
      </div>

      <div className="h-24"></div>

      <div className="ml-1/4 flex-grow overflow-y-scroll">{children}</div>
    </div>
  );
}
