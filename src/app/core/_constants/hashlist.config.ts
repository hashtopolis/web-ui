/**
 * Storage format of a hashlist, matching the `format` attribute returned by the API.
 */
export const HashListFormat = {
  TEXT: 0,
  HCCAPX_PMKID: 1,
  BINARY: 2,
  SUPERHASHLIST: 3
} as const;
export type HashListFormat = (typeof HashListFormat)[keyof typeof HashListFormat];

export const HashListFormatLabels: Record<HashListFormat, string> = {
  [HashListFormat.TEXT]: 'Text',
  [HashListFormat.HCCAPX_PMKID]: 'HCCAPX / PMKID',
  [HashListFormat.BINARY]: 'Binary',
  [HashListFormat.SUPERHASHLIST]: 'Superhashlist'
};

/**
 * Hashcat modes whose hashes are supplied as HCCAPX/PMKID capture files
 * (WPA-EAPOL-PBKDF2, WPA-PMKID-PBKDF2, WPA-PMKID-PMK), so picking one of them
 * forces `HashListFormat.HCCAPX_PMKID`.
 */
export const HCCAPX_PMKID_HASH_TYPE_IDS: readonly number[] = [2500, 16800, 16801];

/** Formats a user can pick when creating a hashlist (superhashlists are created separately). */
export const hashlistFormat = [
  { id: HashListFormat.TEXT, name: 'Text' },
  { id: HashListFormat.HCCAPX_PMKID, name: 'HCCAPX / PMKID' },
  { id: HashListFormat.BINARY, name: 'Binary file (single hash)' }
];

/**
 * Bitmask of what an agent sends to the hashcat brain server, matching `brainFeatures`.
 */
export const HashcatBrainFeature = {
  HASHED_PASSWORDS: 1,
  ATTACK_POSITIONS: 2,
  HASHED_PASSWORDS_AND_ATTACK_POSITIONS: 3
} as const;
export type HashcatBrainFeature = (typeof HashcatBrainFeature)[keyof typeof HashcatBrainFeature];

export const HashcatBrainFeatureLabels: Record<HashcatBrainFeature, string> = {
  [HashcatBrainFeature.HASHED_PASSWORDS]: 'Send hashed passwords',
  [HashcatBrainFeature.ATTACK_POSITIONS]: 'Send attack positions',
  [HashcatBrainFeature.HASHED_PASSWORDS_AND_ATTACK_POSITIONS]: 'Send hashed passwords and attack positions'
};

export const hashcatbrainFormat = [
  { id: HashcatBrainFeature.HASHED_PASSWORDS, name: HashcatBrainFeatureLabels[HashcatBrainFeature.HASHED_PASSWORDS] },
  { id: HashcatBrainFeature.ATTACK_POSITIONS, name: HashcatBrainFeatureLabels[HashcatBrainFeature.ATTACK_POSITIONS] },
  {
    id: HashcatBrainFeature.HASHED_PASSWORDS_AND_ATTACK_POSITIONS,
    name: HashcatBrainFeatureLabels[HashcatBrainFeature.HASHED_PASSWORDS_AND_ATTACK_POSITIONS]
  }
];

/**
 * Where the hashes of a new hashlist come from.
 */
export const HashSource = {
  PASTE: 'paste',
  UPLOAD: 'upload',
  IMPORT: 'import',
  URL: 'url'
} as const;
export type HashSource = (typeof HashSource)[keyof typeof HashSource];

export const HashSourceLabels: Record<HashSource, string> = {
  [HashSource.PASTE]: 'Paste Hash(es)',
  [HashSource.UPLOAD]: 'Upload Input',
  [HashSource.IMPORT]: 'Import from server directory',
  [HashSource.URL]: 'URL download'
};

export const hashSource = [
  { id: HashSource.PASTE, name: HashSourceLabels[HashSource.PASTE] },
  { id: HashSource.UPLOAD, name: HashSourceLabels[HashSource.UPLOAD] },
  { id: HashSource.IMPORT, name: HashSourceLabels[HashSource.IMPORT] },
  { id: HashSource.URL, name: HashSourceLabels[HashSource.URL] }
];
