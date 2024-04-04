import Image from "next/image";

import HealthBar from "./HealthBar";
import Messages from "./Messages";

type BattleAreaType = {
  playerHealth: number;
  playerMaxHealth: number;
  monsterHealth: number;
  monsterMaxHealth: number;
  gameLog: string[];
};
export default function BattleArea({
  playerHealth,
  playerMaxHealth,
  monsterHealth,
  monsterMaxHealth,
  gameLog,
}: BattleAreaType) {
  return (
    <div className="relative flex w-full items-end justify-center">
      <div className="relative left-0 ml-4 grid items-center">
        <Image
          src="https://i.imgur.com/qukqXGo.png"
          alt="role"
          width={200}
          height={64}
        />
        <HealthBar health={playerMaxHealth} remainingHealth={playerHealth} />
      </div>
      <div className="h-64 w-[65%] overflow-auto bg-black bg-opacity-50 p-4 text-white">
        {gameLog.map((message) => (
          <Messages key={1} message={message} />
        ))}
      </div>

      <div className="relative right-0 ml-4 grid items-center">
        <Image src="/slime.jpeg" alt="role" width={200} height={64} />
        <HealthBar health={monsterMaxHealth} remainingHealth={monsterHealth} />
      </div>
    </div>
  );
}
