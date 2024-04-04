import { z } from "zod";

import { questTypeEnum } from "@/db/schema";

export const postQuestsRequestSchema = z.object({
  quest_template_id: z.number(),
  game_user_id: z.string().uuid(),
  title: z.string().min(1).max(100),
  level: z.number(),
  type: z.enum(questTypeEnum.enumValues),
});

export const putQuestRequestSchema = z.object({
  id: z.number(),
  done: z.boolean(),
  doneAt: z.string(),
});
