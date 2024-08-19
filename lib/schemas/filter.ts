import { z } from "zod";

const filterSchema = z.record(z.string(), z.array(z.string().nullable()));

export default filterSchema;
