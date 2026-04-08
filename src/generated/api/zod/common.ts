import * as z from 'zod';

export const zErrorResponse = z.object({
    title: z.string().optional(),
    type: z.string().optional(),
    status: z.int()
});

export const zNotFoundResponse = z.object({
    message: z.string(),
    exception: z.object({
        type: z.string().optional(),
        code: z.int().optional(),
        message: z.string().optional(),
        file: z.string().optional(),
        line: z.int().optional()
    }).optional()
});

export const zToken = z.object({
    token: z.string(),
    expires: z.int()
});

export const zTokenRequest = z.array(z.string());
