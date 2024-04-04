import { z } from "zod";

import { characterEnum } from "@/db/schema";

export const postGameUsersRequestSchema = z.object({
  userId: z.string().uuid(),
  character: z.enum(characterEnum.enumValues),
  experience: z.number(),
  healthPoint: z.number(),
  attackPoint: z.number(),
  money: z.number(),
});

export const putGameUsersRequestSchema = z.object({
  userId: z.string().uuid(),
  experience: z.number(),
  healthPoint: z.number(),
  attackPoint: z.number(),
  money: z.number(),
});
