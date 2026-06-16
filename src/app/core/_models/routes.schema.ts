import { z } from 'zod';

const zServiceConfig = z.object({
  URL: z.string(),
  RESOURCE: z.string()
});

export const formRouteType = z.enum(['create', 'edit', 'helper']);

/**
 * Zod schema for route data consumed by FormComponent.
 * Validates that required fields are present and correctly typed.
 */
export const zFormRouteData = z.object({
  kind: z.string(),
  type: formRouteType,
  serviceConfig: zServiceConfig,
  responseSchema: z.custom<z.ZodTypeAny>().optional()
});

export type FormRouteData = z.infer<typeof zFormRouteData>;

/**
 * Zod schema for route data consumed by FormConfigComponent.
 * Same shape minus `type` (FormConfigComponent does not use it).
 */
export const zFormConfigRouteData = z.object({
  kind: z.string(),
  serviceConfig: zServiceConfig
});

export type FormConfigRouteData = z.infer<typeof zFormConfigRouteData>;
