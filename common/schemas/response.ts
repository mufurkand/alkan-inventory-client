import { z } from "zod";
import partSchema from "./part";

const responseSchema = z.object({
  data: z.array(partSchema),
  nextPage: z.union([z.number(), z.boolean()]),
  prevPage: z.union([z.number(), z.boolean()]),
});

export default responseSchema;
