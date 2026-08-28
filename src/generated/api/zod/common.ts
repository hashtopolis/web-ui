import * as z from 'zod';

/**
 * RFC 7807 problem document
 */
export const zErrorResponse = z.object({
  title: z.string().optional(),
  type: z.string().optional(),
  status: z.int()
});

export const zToken = z.object({
  token: z.string(),
  expires: z.int()
});

export const zTokenRequest = z.array(z.string());
