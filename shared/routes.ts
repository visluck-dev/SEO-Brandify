import { z } from "zod";

// Static website - minimal API definitions for compatibility
export const api = {
  contact: {
    submit: {
      method: 'POST' as const,
      path: '/api/contact',
      input: z.object({
        name: z.string(),
        email: z.string(),
        phone: z.string().optional(),
        subject: z.string().optional(),
        message: z.string(),
      }),
      responses: {
        201: z.any(),
        400: z.object({ message: z.string() }),
        500: z.object({ message: z.string() }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
