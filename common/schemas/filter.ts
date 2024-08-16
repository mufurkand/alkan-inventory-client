import { z } from "zod";

const filterSchema = z.object({
  materialType: z.array(z.string().nullable()),
  channel: z.array(z.string().nullable()),
  caseType: z.array(z.string().nullable()),
  voltage: z.array(z.string().nullable()),
  current: z.array(z.string().nullable()),
  value: z.array(z.string().nullable()),
  unit: z.array(z.string().nullable()),
  power: z.array(z.string().nullable()),
});

export default filterSchema;
