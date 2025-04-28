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
  { _id: 0, name: 'Text' },
  { _id: 1, name: 'HCCAPX / PMKID' },
  { _id: 2, name: 'Binary file (single hash)' }
];

export const hashcatbrainFormat = [
  { _id: 1, name: 'Send hashed passwords' },
  { _id: 2, name: 'Send attack positions' },
  { _id: 3, name: 'Send hashed passwords and attack positions' }
];

export const hashSource = [
  { _id: 'paste', name: 'Expand Text Area' },
  { _id: 'import', name: 'Upload Input' }
];
