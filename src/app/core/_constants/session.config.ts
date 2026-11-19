/**
 * Shortest session lifetime in seconds the server accepts; it matches the access token lifetime.
 */
export const SESSION_LIFETIME_MIN_SECONDS = 2 * 3600;

/**
 * Maximum session length in hours the server uses when the maxSessionLength setting is unusable.
 */
export const SESSION_LENGTH_FALLBACK_HOURS = 48;

/**
 * Session lifetimes in hours a user can choose from, as far as the maximum session length allows.
 */
export const SESSION_LIFETIME_PRESET_HOURS = [2, 4, 8, 12, 24, 48, 72, 168];
