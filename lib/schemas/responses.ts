import { z } from "zod";
import partSchema from "./part";

const tableResponseSchema = z.object({
  data: z.array(partSchema),
  nextPage: z.union([z.number(), z.boolean()]),
  prevPage: z.union([z.number(), z.boolean()]),
});

const uniqueConstraintErrorSchema = z.object({
  statusCode: z.number(),
  timestamp: z.string(),
  path: z.string(),
  error: z.string(),
  message: z.string(),
  target: z.string().array(),
});

export { tableResponseSchema, uniqueConstraintErrorSchema };
