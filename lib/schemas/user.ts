import { z } from "zod";

const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  role: z.string(),
});

export default userSchema;
