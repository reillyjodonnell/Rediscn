import { z } from 'zod';

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const itemSchema = z.object({
  key: z.string(),
  value: z.string(),
});

export type Item = z.infer<typeof itemSchema>;
