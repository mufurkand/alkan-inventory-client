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

const statusResponseSchema = z.object({
  id: z.number(),
  username: z.string(),
  role: z.string(),
});

const loginResponseSchema = z.object({
  token: z.string(),
  user: statusResponseSchema,
});

export {
  tableResponseSchema,
  uniqueConstraintErrorSchema,
  statusResponseSchema,
  loginResponseSchema,
};
