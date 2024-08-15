import { z } from "zod";

const responseSchema = z.object({
  data: z.array(
    z.object({
      id: z.number(),
      materialType: z.string(),
      partNumber: z.string(),
      location: z.string(),
      price: z.number().nullable(),
      quantity: z.number().nullable(),
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
    })
  ),
  nextPage: z.union([z.number(), z.boolean()]),
  prevPage: z.union([z.number(), z.boolean()]),
});

export default responseSchema;
