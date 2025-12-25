// Static website - minimal schema for type definitions
// All content is in client-side constants

import { z } from "zod";

// Basic page metadata
export const pageSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export type PageMeta = z.infer<typeof pageSchema>;
