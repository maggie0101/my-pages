"use client";

import { FaCartPlus } from "react-icons/fa";

import useGameUser from "@/hooks/useGameUser";
import useShop from "@/hooks/useShop";
import { type GameUser } from "@/lib/types/db";

/* eslint-disable @next/next/no-img-element */

type ItemTemplateProps = {
  id: number;
  name: string;
  image: string;
  price: number;
  gameUser: GameUser;
};

export default function PlantTemplate({
  id,
  name,
  image,
  price,
  gameUser,
}: ItemTemplateProps) {
  const { buyShopPlant } = useShop();
  const { putGameUser } = useGameUser();

  const handleBuyShopPlant = async () => {
    try {
      if (gameUser.money! - price < 0) {
        alert("餘額不足！");
        return;
      }
      await buyShopPlant({ plantId: id });
      await putGameUser({
        userId: gameUser.userId,
        experience: gameUser.experience!,
        healthPoint: gameUser.healthPoint!,
        attackPoint: gameUser.attackPoint!,
        money: gameUser.money! - price,
      });
      alert(`您已成功購買 ${name}，扣款${price}元`);
    } catch (e) {
      console.log(e);
      alert(e);
    }
  };
  return (
    <div className="group relative mb-4 ml-4 mr-4 mt-4 h-[300px] overflow-hidden rounded-xl bg-orange-200 bg-opacity-50 transition">
      <div className="flex h-full w-full flex-col items-center justify-center ">
        <div className="mx-auto flex w-[140px] items-center justify-center">
          <img
            className="max-h-[140px] transition duration-300 group-hover:scale-105"
            src={image}
            alt="plant"
          />
        </div>
        <div>{name}</div>
        <div>{price}</div>
        <div className="absolute bottom-0 w-full bg-purple-700 bg-opacity-20 p-2  ">
          <button className="w-full" onClick={handleBuyShopPlant}>
            <div className="flex items-center justify-center text-white ">
              購買
              <FaCartPlus className="text-2xl" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
