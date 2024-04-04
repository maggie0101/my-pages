export type User = {
  id: string;
  username: string;
  email: string;
  provider: "github" | "credentials";
};

export type Quest = {
  id: number;
  quest_template_id: number;
  game_user_id: string;
  title: string;
  level: number;
  type: "daily" | "weekly";
  createdAt: Date | null;
  done: boolean | null;
  doneAt: Date | null;
};

export type Card = {
  id: number;
  name: string;
  imageUrl: string;
  attack: number;
  shield: number;
  cost: number;
};

export type GameUser = {
  id: number;
  userId: string;
  character: "study" | "health" | "work" | "hobby";
  experience: number | null;
  healthPoint: number;
  attackPoint: number;
  money: number | null;
};

export type Item = {
  id: number | null;
  imageUrl: string | null;
  name: string | null;
  attackBuff: number | null;
  healthBuff: number | null;
  moneyBuff: number | null;
  price: number | null;
};
