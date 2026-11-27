import { buildPermissionMatrix } from '@src/app/shared/utils/permission-matrix';

describe('buildPermissionMatrix', () => {
  it('groups CRUD permissions by resource and sorts rows by display name', () => {
    const permissions = {
      permTaskRead: true,
      permAgentBinaryCreate: true,
      permTaskCreate: false,
      permTaskUpdate: true,
      permTaskDelete: false,
      permAgentBinaryRead: false
    };

    const rows = buildPermissionMatrix(permissions);

    expect(rows).toStrictEqual([
      {
        id: 1,
        type: 'userPermission',
        name: 'Agent binary',
        key: 'AgentBinary',
        create: true,
        read: false,
        update: false,
        delete: false,
        keys: { create: 'permAgentBinaryCreate', read: 'permAgentBinaryRead' }
      },
      {
        id: 0,
        type: 'userPermission',
        name: 'Task',
        key: 'Task',
        create: false,
        read: true,
        update: true,
        delete: false,
        keys: {
          create: 'permTaskCreate',
          read: 'permTaskRead',
          update: 'permTaskUpdate',
          delete: 'permTaskDelete'
        }
      }
    ]);
  });

  it('returns an empty matrix for empty permissions', () => {
    const permissions = {};

    const rows = buildPermissionMatrix(permissions);

    expect(rows).toStrictEqual([]);
  });

  it('ignores keys without a recognized CRUD suffix', () => {
    const permissions = {
      permTaskExecute: true,
      permTaskReadExtra: true,
      permHashRead: false
    };

    const rows = buildPermissionMatrix(permissions);

    expect(rows).toStrictEqual([
      {
        id: 0,
        type: 'userPermission',
        name: 'Hash',
        key: 'Hash',
        create: false,
        read: false,
        update: false,
        delete: false,
        keys: { read: 'permHashRead' }
      }
    ]);
  });
});
