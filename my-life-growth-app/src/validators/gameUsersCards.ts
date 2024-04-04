import { z } from "zod";

export const postGameUsersCardsRequestSchema = z.object({
  userId: z.string().uuid(),
  cardId: z.number(),
});
