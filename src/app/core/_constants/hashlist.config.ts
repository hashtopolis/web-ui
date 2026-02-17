export const HashListFormat = {
  TEXT: 0,
  HCCAPX_PMKID: 1,
  BINARY: 2,
  SUPERHASHLIST: 3
};

export const HashListFormatLabel = {
  [HashListFormat.TEXT]: 'Text',
  [HashListFormat.HCCAPX_PMKID]: 'HCCAPX / PMKID',
  [HashListFormat.BINARY]: 'Binary',
  [HashListFormat.SUPERHASHLIST]: 'Superhashlist'
};

export const hashlistFormat = [
  { id: 0, name: 'Text' },
  { id: 1, name: 'HCCAPX / PMKID' },
  { id: 2, name: 'Binary file (single hash)' }
];

export const hashcatbrainFormat = [
  { id: 1, name: 'Send hashed passwords' },
  { id: 2, name: 'Send attack positions' },
  { id: 3, name: 'Send hashed passwords and attack positions' }
];

export const hashSource = [
  { id: 'paste', name: 'Paste Hash(es)' },
  { id: 'upload', name: 'Upload Input' },
  { id: 'import', name: 'Import from server directory' },
  { id: 'url', name: 'URL download' }
];
