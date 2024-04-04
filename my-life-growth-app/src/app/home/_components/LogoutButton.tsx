"use client";

import React from "react";

import { useRouter } from "next/navigation";

import { LogOut, MoreHorizontal } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();

  return (
    <div className="flex flex-row">
      <button
        className="group w-full"
        onClick={() => {
          router.push("/");
        }}
      >
        <div className="flex w-fit items-center gap-4 rounded-full p-2 transition-colors duration-300 group-hover:bg-gray-200 lg:pr-4">
          <div className="grid h-[40px] w-[40px] place-items-center">
            <LogOut size={26} />
          </div>
          <span className="text-xl max-lg:hidden">登出</span>
        </div>
      </button>
      <button className="group">
        <div className="flex w-fit items-center gap-4 rounded-full p-2 transition-colors duration-300 group-hover:bg-gray-200 lg:pr-4">
          <div className="grid h-[40px] w-[40px] place-items-center">
            <MoreHorizontal size={26} />
          </div>
        </div>
      </button>
    </div>
  );
}
