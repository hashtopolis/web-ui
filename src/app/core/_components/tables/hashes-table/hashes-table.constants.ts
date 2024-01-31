export enum HashesTableCol {
  HASHES,
  PLAINTEXT,
  SALT,
  CRACK_POSITION,
  ISCRACKED,
  TIMECRACKED
}

export const HashesTableColColumnLabel = {
  [HashesTableCol.HASHES]: 'Hashes',
  [HashesTableCol.PLAINTEXT]: 'Plaintext',
  [HashesTableCol.SALT]: 'Salt',
  [HashesTableCol.CRACK_POSITION]: 'Crack position',
  [HashesTableCol.ISCRACKED]: 'Cracked',
  [HashesTableCol.TIMECRACKED]: 'Time cracked'
};
