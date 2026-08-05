import { z } from 'zod';

export const changeOwnPasswordResponseSchema = z.object({
  meta: z.object({
    'Change password': z.string()
  })
});
