import { z } from "zod";

const partSchema = z.object({
  id: z.number(),
  materialType: z.string(),
  partNumber: z.string(),
  location: z.string().nullable(),
  price: z.string().nullable(),
  quantity: z.string().nullable(),
  channel: z.string().nullable(),
  caseType: z.string().nullable(),
  voltage: z.string().nullable(),
  current: z.string().nullable(),
  value: z.string().nullable(),
  unit: z.string().nullable(),
  power: z.string().nullable(),
  description: z.string().nullable(),
  imagePath: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export default partSchema;
