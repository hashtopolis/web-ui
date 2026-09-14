import * as z from 'zod';

import { zToken, zTokenRequest } from './common';

export const zPostTokenBody = zTokenRequest;

/**
 * Success
 */
export const zPostTokenResponse = zToken;
