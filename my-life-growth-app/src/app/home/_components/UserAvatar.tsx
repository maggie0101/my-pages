"use client";

import React from "react";

import { cn } from "@/lib/utils";

type UserAvatarProps = {
  className?: string;
};

export default function UserAvatar({ className }: UserAvatarProps) {
  // const { avatarURL } = useUserInfo();
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={"https://avatars.githubusercontent.com/u/97165289"}
      alt="user avatar"
      width={48}
      height={48}
      className={cn(className, "rounded-full")}
    />
  );
}
