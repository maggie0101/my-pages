import { useState } from "react";

import type { Card } from "@/lib/types/db";

type Fighter = {
  name: string;
  attack: number;
  health: number;
};

const nullFighter = {
  name: "",
  attack: 0,
  health: 0,
};

type StartGameParam = {
  player: Fighter;
  monster: Fighter;
  maxPower: number;
  cards: Card[];
};

type GameState = "WIN" | "LOSE" | "RUNNING" | "PENDING";

const statusOK = { status: "OK" } as const;
const statusError = (message: string): Status => ({ status: "ERROR", message });

export type Status = { status: "OK" | "ERROR"; message?: string };

/**
 * This is the hook for the card game.
 * Play the game as the following steps:
 * First, pass in the game settings using `startGame`.
 * Then for every round:
 * 1. Call `playCard` several times and check if win.
 * 2. End the round by calling `draw`.
 * 3. The monster attack, check if lose.
 *
 * All the methods return {Status}
 */
export default function useGame() {
  const [playerHealth, setPlayerHealth] = useState(0);
  const [monsterHealth, setMonsterHealth] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [power, setPower] = useState(0);
  const [gameLog, setGameLog] = useState<string[]>([]);
  const [hand, setHand] = useState<(Card & { used: boolean })[]>([]);
  const [result, setResult] = useState<GameState>("PENDING");
  const [cardPool, setCardPool] = useState<Card[]>([]);
  const [playerInfo, setPlayerInfo] = useState<Fighter>(nullFighter);
  const [monsterInfo, setMonsterInfo] = useState<Fighter>(nullFighter);
  const [fullPower, setFullPower] = useState<number>(0);
  const [playerShield, setPlayerShield] = useState(0);

  const appendGameLog = (message: string) => {
    setGameLog((gameLog) => [...gameLog, message]);
  };

  const startGame = ({
    player,
    monster,
    maxPower,
    cards,
  }: StartGameParam): Status => {
    setPlayerHealth(player.health);
    setMonsterHealth(monster.health);
    setPower(maxPower);
    setGameLog([]);
    setRounds(1);
    setResult("RUNNING");
    setCardPool(cards);
    setPlayerInfo(player);
    setMonsterInfo(monster);
    setFullPower(maxPower);
    const status = fillCards(cards);
    if (status.status != "OK") {
      return status;
    }
    return statusOK;
  };

  /**
   * Plays the card of `cardId`.
   * Returns error if the `cardId` is not in hand or already used.
   */
  const playCard = ({ cardId }: { cardId: number }): Status => {
    if (result != "RUNNING") {
      return statusError("Not running.");
    }

    const index = cardId;
    if (index < 0 || index >= 5) {
      return statusError(`卡片超出範圍`);
    }
    const card = hand[index];
    if (card.cost > power) {
      appendGameLog(`無法使用${card.name}： 能量不足`);
      return statusError(`能量不足`);
    }
    setPower(power - card.cost);
    setHand(
      hand.map((card, current) =>
        index == current ? { ...card, used: true } : card,
      ),
    );

    if (card.attack != 0) {
      const damage = (playerInfo.attack * card.attack) / 100;
      appendGameLog(
        `${playerInfo.name}使用${card.name}對${monsterInfo.name}造成了 ${damage} 點傷害`,
      );
      if (damage >= monsterHealth) {
        setMonsterHealth(0);
        setResult("WIN");
        appendGameLog(`成功擊殺${monsterInfo.name}，挑戰成功`);
        return statusOK;
      }
      setMonsterHealth(monsterHealth - damage);
    }

    if (card.shield != 0) {
      setPlayerShield(playerShield + card.shield);
      appendGameLog(
        `${playerInfo.name}使用${card.name}為自己增加了${card.shield}點護盾`,
      );
    }

    return statusOK;
  };

  const fillCards = (syncCard?: Card[]) => {
    const maxCards = 5;
    const choice = (): Card => {
      const cards = syncCard ?? cardPool;
      return cards.at(Math.floor(Math.random() * cards.length))!;
    };
    appendGameLog(`第${rounds}回合，抽牌！`);
    setPlayerShield(0);
    setHand(
      new Array(maxCards)
        .fill(0)
        .map(() => choice())
        .map((card) => ({
          ...card,
          used: false,
        })),
    );
    return statusOK;
  };

  const monsterAction = () => {
    let damage = Math.floor(monsterInfo.attack * (0.75 + Math.random() * 0.5)); // random damage [75%, 125%]

    appendGameLog(
      `${monsterInfo.name}對${playerInfo.name}造成了 ${damage} 點傷害`,
    );
    if (playerShield > 0) {
      const reduce = Math.min(damage, playerShield);
      damage -= reduce;
      appendGameLog(`護頓成功替${playerInfo.name}減少了 ${reduce} 點傷害`);
    }
    if (damage >= playerHealth) {
      setPlayerHealth(0);
      setResult("LOSE");
      appendGameLog(`${playerInfo.name}已經陣亡，挑戰失敗`);
      return "DEAD";
    }
    setPlayerHealth(playerHealth - damage);
    return "OK";
  };

  const draw = () => {
    if (result != "RUNNING" || monsterAction() == "DEAD") {
      return statusError("Not running or already dead.");
    }
    setRounds(rounds + 1);
    fillCards();
    setPower(fullPower);
    return statusOK;
  };

  return {
    startGame,
    playCard,
    draw,
    playerHealth,
    monsterHealth,
    rounds,
    power,
    gameLog,
    hand,
    result,
  };
}
