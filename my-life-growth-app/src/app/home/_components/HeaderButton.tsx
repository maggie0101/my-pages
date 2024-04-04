"use client";

import React from "react";

import { useRouter } from "next/navigation";

type HeaderButtonProps = {
  children: React.ReactNode;
  text: string;
  link: string;
};

export default function HeaderButton({
  children,
  text,
  link,
}: HeaderButtonProps) {
  const router = useRouter();
  return (
    <button
      className="group w-full"
      onClick={() => {
        router.push(`/home/${link}`);
      }}
    >
      <div className="flex w-fit items-center gap-4 rounded-full p-2 transition-colors duration-300 group-hover:bg-gray-200 lg:pr-4">
        <div className="grid h-[40px] w-[40px] place-items-center">
          {children}
        </div>
        <span className="text-xl max-lg:hidden">{text}</span>
      </div>
    </button>
  );
}
