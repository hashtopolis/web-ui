export const ApiTokensTableCol = {
  ID: 0,
  VALID_FROM: 1,
  VALID_UNTIL: 2,
  STATUS: 3,
  CREATOR: 4
} as const;
export type ApiTokensTableCol = (typeof ApiTokensTableCol)[keyof typeof ApiTokensTableCol];

export const ApiTokensTableColumnLabel: Record<ApiTokensTableCol, string> = {
  [ApiTokensTableCol.ID]: 'ID',
  [ApiTokensTableCol.VALID_FROM]: 'Valid From',
  [ApiTokensTableCol.VALID_UNTIL]: 'Expires At',
  [ApiTokensTableCol.STATUS]: 'Status',
  [ApiTokensTableCol.CREATOR]: 'Creator'
};
