import * as z from 'zod';

import { zToken, zTokenRequest } from './common';

export const zPostTokenData = z.object({
  body: zTokenRequest,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * Success
 */
export const zPostTokenResponse = zToken;
