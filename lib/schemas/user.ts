import { z } from "zod";

const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  role: z.union([z.literal("USER"), z.literal("ADMIN")]),
});

export default userSchema;
