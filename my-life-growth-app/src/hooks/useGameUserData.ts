import type { characterEnumType } from "@/db/schema";
import type { GameUser, Item } from "@/lib/types/db";

export default function useGameUserData() {
  const getLevelByExperience = ({ experience }: { experience: number }) => {
    let level = 1;
    while (experience >= level * 10) {
      experience -= level * 10;
      level += 1;
    }
    return { level, experience };
  };

  // for db
  const countBasicStatus = ({
    level,
    character,
  }: {
    level: number;
    character: characterEnumType;
  }) => {
    let characterStatus = {};

    switch (character) {
      case "study":
        characterStatus = {
          health: 50 + (level - 1) * 2,
          attack: 100 + (level - 1) * 6,
        };
        break;
      case "health":
        characterStatus = {
          health: 100 + (level - 1) * 6,
          attack: 50 + (level - 1) * 2,
        };
        break;
      case "work":
        characterStatus = {
          health: 75 + (level - 1) * 4,
          attack: 75 + (level - 1) * 4,
        };
        break;
      case "hobby":
        characterStatus = {
          health: 75 + (level - 1) * 4,
          attack: 50 + (level - 1) * 2,
        };
        break;
      default:
        break;
    }

    return characterStatus;
  };

  const countCurrentStatus = ({
    gameUser,
    items,
  }: {
    gameUser: GameUser;
    items: Item[];
  }) => {
    const buffStatus = {
      health: 0,
      attack: 0,
    };

    items.forEach((item) => {
      buffStatus.health += item.healthBuff ?? 0;
      buffStatus.attack += item.attackBuff ?? 0;
    });

    const characterCurrentStatus = {
      health: gameUser.healthPoint + buffStatus.health,
      attack: gameUser.attackPoint + buffStatus.attack,
      power: gameUser.character === "hobby" ? 4 : 3,
    };

    return characterCurrentStatus;
  };

  return {
    getLevelByExperience,
    countBasicStatus,
    countCurrentStatus,
  };
}
