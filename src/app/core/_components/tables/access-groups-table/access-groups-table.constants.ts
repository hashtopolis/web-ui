export enum AccessGroupsTableCol {
  ID,
  NAME,
  NUSERS,
  NAGENTS
}

export const AccessGroupsTableColumnLabel = {
  [AccessGroupsTableCol.ID]: 'ID',
  [AccessGroupsTableCol.NAME]: 'Name',
  [AccessGroupsTableCol.NUSERS]: '# of Members',
  [AccessGroupsTableCol.NAGENTS]: '# of Agents'
};
