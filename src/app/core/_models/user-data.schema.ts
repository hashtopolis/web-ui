import { z } from 'zod';

export const userDataSchema = z.object({
  _token: z.string(),
  _expires: z.string().datetime()
});

export type UserData = z.infer<typeof userDataSchema>;
