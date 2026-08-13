export const ApiTokensTableCol = {
  ID: 0,
  TOKEN_NAME: 1,
  VALID_FROM: 2,
  VALID_UNTIL: 3,
  STATUS: 4,
  CREATOR: 5
} as const;
export type ApiTokensTableCol = (typeof ApiTokensTableCol)[keyof typeof ApiTokensTableCol];

export const ApiTokensTableColumnLabel: Record<ApiTokensTableCol, string> = {
  [ApiTokensTableCol.ID]: 'ID',
  [ApiTokensTableCol.TOKEN_NAME]: 'Token Name',
  [ApiTokensTableCol.VALID_FROM]: 'Valid From',
  [ApiTokensTableCol.VALID_UNTIL]: 'Expires At',
  [ApiTokensTableCol.STATUS]: 'Status',
  [ApiTokensTableCol.CREATOR]: 'Creator'
};

export const ApiTokensRowAction = { REVOKE: 'revoke' } as const;
export type ApiTokensRowAction = (typeof ApiTokensRowAction)[keyof typeof ApiTokensRowAction];

export const ApiTokensRowActionLabel = { REVOKE: 'Revoke API Key' } as const;
export const ApiTokensRowActionIcon = { REVOKE: 'block' } as const;

export const ApiTokensTableEditableAction = {
  CHANGE_TOKEN_NAME: 'change-token-name'
} as const;
export type ApiTokensTableEditableAction =
  (typeof ApiTokensTableEditableAction)[keyof typeof ApiTokensTableEditableAction];
