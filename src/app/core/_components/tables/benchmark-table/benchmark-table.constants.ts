export enum BenchmarkTableCol {
  ID,
  CRACKER,
  HASH_MODE,
  ATTACK,
  DEVICE,
  TYPE,
  VALUE,
  CREATED,
  EXPIRES
}

export const BenchmarkTableColumnLabel = {
  [BenchmarkTableCol.ID]: 'ID',
  [BenchmarkTableCol.CRACKER]: 'Cracker Binary',
  [BenchmarkTableCol.HASH_MODE]: 'Hash mode (-m)',
  [BenchmarkTableCol.ATTACK]: 'Attack (sig)',
  [BenchmarkTableCol.DEVICE]: 'Device (sig)',
  [BenchmarkTableCol.TYPE]: 'Type',
  [BenchmarkTableCol.VALUE]: 'Value',
  [BenchmarkTableCol.CREATED]: 'Created',
  [BenchmarkTableCol.EXPIRES]: 'Expires'
};
