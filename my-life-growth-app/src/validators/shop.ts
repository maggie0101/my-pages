import { z } from "zod";

export const buyShopItemRequestSchema = z.object({
  itemId: z.number(),
});

export const buyShopPetRequestSchema = z.object({
  petId: z.number(),
});
export const buyShopPlantRequestSchema = z.object({
  plantId: z.number(),
});
