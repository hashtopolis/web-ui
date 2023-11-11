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
