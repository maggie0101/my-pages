import React from "react";

import { Store, MailQuestion, Swords } from "lucide-react";

import HeaderButton from "./HeaderButton";
import LogoutButton from "./LogoutButton";
import ProfileButton from "./ProfileButton";

export default function Navbar() {
  return (
    <div
      className="h-screen  w-full"
      style={{
        backgroundImage: "url('https://i.imgur.com/xeW3J71.jpg')",
      }}
    >
      <aside className="flex h-screen flex-col justify-between px-6 py-6">
        <div className="flex flex-col gap-2">
          <div className="flex w-fit items-center gap-4 rounded-full p-2">
            <ProfileButton />
          </div>
          <HeaderButton text="任務列表" link="quest">
            <MailQuestion size={26} />
          </HeaderButton>
          {/* <HeaderButton text="農場" link="farm">
            <Vegan size={26} />
          </HeaderButton> */}
          {/* <HeaderButton text="社群" link="community">
            <Users size={26} />
          </HeaderButton> */}
          <HeaderButton text="商場" link="shop">
            <Store size={26} />
          </HeaderButton>
          <HeaderButton text="卡牌戰場" link="battle">
            <Swords size={26} />
          </HeaderButton>
          {/* <HeaderButton text="本日抽卡" link="card">
            <Dices size={26} />
          </HeaderButton> */}
        </div>
        <LogoutButton />
      </aside>
    </div>
  );
}
