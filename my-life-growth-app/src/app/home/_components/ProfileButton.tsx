"use client";

import React from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import UserAvatar from "./UserAvatar";

export default function ProfileButton() {
  const { data: session } = useSession();
  const router = useRouter();
  return (
    <button
      className="mr-2 flex items-center gap-2 rounded-full p-2 text-start transition-colors duration-300 hover:bg-gray-200"
      onClick={() => {
        router.push(`/home`);
      }}
    >
      <UserAvatar />
      <div className="w-40 max-lg:hidden">
        <p className="text-sm font-bold">{session?.user?.username}</p>
        <p className="text-sm text-gray-500">{session?.user?.email}</p>
      </div>
    </button>
  );
}
