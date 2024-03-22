export enum InputFieldsTableCol {
  NAME,
  NOTES,
  HASH_MODE,
  HASH_COUNT,
  RETRIEVED,
  KEYSPACE
}

export const InputFieldsTableColumnLabel = {
  [InputFieldsTableCol.NAME]: 'Names',
  [InputFieldsTableCol.NOTES]: 'Notes',
  [InputFieldsTableCol.HASH_MODE]: 'Hash Mode',
  [InputFieldsTableCol.HASH_COUNT]: 'Hash Count',
  [InputFieldsTableCol.RETRIEVED]: 'Retrieved',
  [InputFieldsTableCol.KEYSPACE]: 'Total Keyspace explored'
};
