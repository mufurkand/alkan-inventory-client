import { z } from "zod";
import partSchema from "./part";
import userSchema from "./user";

const partsResponseSchema = z.object({
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

const statusResponseSchema = userSchema;

const loginResponseSchema = z.object({
  token: z.string(),
  user: statusResponseSchema,
});

const usersResponseSchema = z.array(statusResponseSchema);

export {
  partsResponseSchema,
  uniqueConstraintErrorSchema,
  statusResponseSchema,
  loginResponseSchema,
  usersResponseSchema,
};
