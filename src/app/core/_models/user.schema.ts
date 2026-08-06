import { z } from 'zod';

export const JUserSchema = z
  .object({
    id: z.number(),
    type: z.string(),
    email: z.string().optional(),
    name: z.string(),
    registeredSince: z.number().optional(),
    isComputedPassword: z.boolean().optional(),
    isValid: z.boolean().optional(),
    lastLoginDate: z.number().optional(),
    sessionLifetime: z.number().optional(),
    globalPermissionGroupId: z.number().optional(),
    otp1: z.string().nullable().optional(),
    otp2: z.string().nullable().optional(),
    otp3: z.string().nullable().optional(),
    otp4: z.string().nullable().optional(),
    yubikey: z.string().nullable().optional()
  })
  .passthrough();

export type JUserSchema = z.infer<typeof JUserSchema>;
