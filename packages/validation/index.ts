import { z } from "zod";

export const CoordinatesSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

export const ShopSchema = z.object({
  id: z.union([z.number(), z.string()]),
  name: z.string(),
  area: z.string(),
  city: z.string(),
  category: z.string(),
  products: z.array(z.string()),
  rating: z.number(),
  reviews: z.number(),
  price: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  open: z.boolean(),
  distance: z.number(),
  specialty: z.string(),
  phone: z.string(),
  hours: z.string(),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export type ShopInput = z.infer<typeof ShopSchema>;
