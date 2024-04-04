import { z } from "zod";

import { questTypeEnum } from "@/db/schema";

export const postQuestTemplateRequestSchema = z.object({
  title: z.string().min(1).max(100),
  level: z.number(),
  createdBy: z.string().uuid(),
  type: z.enum(questTypeEnum.enumValues),
});

export const putQuestTemplateRequestSchema = z.object({
  id: z.number(),
  enable: z.boolean(),
});
