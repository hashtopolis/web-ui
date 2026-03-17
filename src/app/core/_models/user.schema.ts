import { z } from 'zod';

export const JUserSchema = z
  .object({
    id: z.number(),
    type: z.string(),
    email: z.string().email(),
    name: z.string(),
    registeredSince: z.number(),
    isComputedPassword: z.boolean(),
    isValid: z.boolean(),
    lastLoginDate: z.number(),
    sessionLifetime: z.number(),
    globalPermissionGroupId: z.number(),
    otp1: z.string().nullable().optional(),
    otp2: z.string().nullable().optional(),
    otp3: z.string().nullable().optional(),
    otp4: z.string().nullable().optional(),
    yubikey: z.string().nullable().optional()
  })
  .passthrough();

export type JUserSchema = z.infer<typeof JUserSchema>;
