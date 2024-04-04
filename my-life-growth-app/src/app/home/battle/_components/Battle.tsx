"use client";

import React, { useState } from "react";

import useGame from "@/hooks/useGame";
import useGameUserData from "@/hooks/useGameUserData";
import type { Card, GameUser, Item } from "@/lib/types/db";

import BattleArea from "./BattleArea";
import CardArea from "./CardArea";
import EnergySign from "./EnergySign";
import NextRoundSign from "./NextRoundSign";

type BattleParam = {
  gameUser: GameUser;
  cards: Card[];
  items: Item[];
};
export default function Battle({ gameUser, cards, items }: BattleParam) {
  const {
    startGame,
    playCard,
    draw,
    result,
    hand,
    monsterHealth,
    playerHealth,
    gameLog,
    power,
  } = useGame();

  const { countCurrentStatus } = useGameUserData();

  const userStatus = countCurrentStatus({ gameUser, items });
  const [healthRandom] = useState(Math.random());
  const [attackRandom] = useState(Math.random());

  const maxPower = userStatus.power;
  const playerMaxHealth = userStatus.health;

  const monsterMaxHealth = Math.floor(
    userStatus.health * (0.75 + healthRandom * 0.5),
  );

  const onStart = () => {
    console.log({
      gameUser,
      cards,
      items,
      userStatus,
    });
    startGame({
      player: {
        attack: userStatus.attack,
        health: playerMaxHealth,
        name: "冒險者",
      },
      monster: {
        attack: Math.floor(
          ((userStatus.attack * 6) / 100) * (1.25 + attackRandom * 0.5),
        ),
        health: monsterMaxHealth,
        name: "超巨型史萊姆",
      },
      cards,
      maxPower,
    });
  };

  return (
    <>
      {result == "PENDING" ? (
        <div className="h-20 w-full rounded-full bg-red-700/80  shadow-2xl hover:bg-red-800/90">
          <button
            className="h-full w-full focus:outline-none"
            onClick={() => onStart()}
          >
            <div className="text-center text-lg font-semibold text-white hover:text-white ">
              開始冒險
            </div>
          </button>
        </div>
      ) : (
        <>
          <BattleArea
            playerHealth={playerHealth}
            monsterHealth={monsterHealth}
            playerMaxHealth={playerMaxHealth}
            monsterMaxHealth={monsterMaxHealth}
            gameLog={gameLog}
          />

          <div className="relative flex w-full">
            <EnergySign current={power} max={maxPower} />
            <NextRoundSign draw={draw} />
          </div>
          <CardArea hand={hand} playCard={playCard} />
        </>
      )}
    </>
  );
}
