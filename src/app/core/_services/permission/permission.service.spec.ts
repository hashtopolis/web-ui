import { firstValueFrom, of, skip, take, throwError } from 'rxjs';
import type { MockedObject } from 'vitest';

import { TestBed } from '@angular/core/testing';

import { Permission } from '@models/global-permission-group.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { PermissionService } from '@services/permission/permission.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

import { Agent } from '@src/app/core/_constants/userpermissions.config';
import { mockResponse } from '@src/app/testing/mock-response';

describe('PermissionService', () => {
  let storage: MockedObject<LocalStorageService<Permission>>;
  let gs: MockedObject<GlobalService>;
  let serializer: MockedObject<JsonAPISerializer>;
  let service: PermissionService;

  beforeEach(() => {
    storage = {
      getItem: vi.fn().mockName('LocalStorageService.getItem'),
      setItem: vi.fn().mockName('LocalStorageService.setItem'),
      removeItem: vi.fn().mockName('LocalStorageService.removeItem')
    } as MockedObject<LocalStorageService<Permission>>;
    gs = { ghelper: vi.fn().mockName('GlobalService.ghelper') } as MockedObject<GlobalService>;
    serializer = { deserialize: vi.fn().mockName('JsonAPISerializer.deserialize') } as MockedObject<JsonAPISerializer>;
    TestBed.configureTestingModule({
      providers: [
        PermissionService,
        { provide: GlobalService, useValue: gs },
        { provide: JsonAPISerializer, useValue: serializer },
        { provide: LocalStorageService, useValue: storage }
      ]
    });
    service = TestBed.inject(PermissionService);
  });

  it('uses cached permissions for synchronous and observable checks', async () => {
    const permissions = { [Agent.READ]: true };
    storage.getItem.mockReturnValue(permissions);
    await expect(firstValueFrom(service.loadPermissions())).resolves.toStrictEqual(permissions);
    await expect(firstValueFrom(service.hasPermission(Agent.READ))).resolves.toBe(true);
    expect(service.hasAllPermissionsSync([Agent.READ, Agent.DELETE])).toBe(false);
    expect(gs.ghelper).not.toHaveBeenCalled();
    service.clearPermissionCache();
    expect(storage.removeItem).toHaveBeenCalledExactlyOnceWith('user_permissions');
  });

  it('loads and caches permissions when absent', async () => {
    const permissions = { [Agent.READ]: true };
    storage.getItem.mockReturnValue(null);
    gs.ghelper.mockReturnValue(of(mockResponse()));
    serializer.deserialize.mockReturnValue({ permissions });
    await expect(firstValueFrom(service.loadPermissions())).resolves.toStrictEqual(permissions);
    expect(gs.ghelper).toHaveBeenCalledExactlyOnceWith(SERV.HELPER, 'getUserPermission');
    expect(storage.setItem).toHaveBeenCalledExactlyOnceWith('user_permissions', permissions, 900000);
    expect(service.hasPermissionSync(Agent.READ)).toBe(true);
  });

  it('emits updated permissions and handles granted and denied checks', async () => {
    const update = firstValueFrom(service.getPermissions().pipe(skip(1), take(1)));
    const permissions = { [Agent.READ]: true, [Agent.CREATE]: true };
    storage.getItem.mockReturnValue(permissions);
    await firstValueFrom(service.loadPermissions());
    await expect(update).resolves.toStrictEqual(permissions);
    await expect(firstValueFrom(service.hasPermission(Agent.DELETE))).resolves.toBe(false);
    expect(service.hasAllPermissionsSync([Agent.READ, Agent.CREATE])).toBe(true);
  });

  it('propagates API errors without caching permissions', async () => {
    const error = new Error('API failed');
    storage.getItem.mockReturnValue(null);
    gs.ghelper.mockReturnValue(throwError(() => error));
    await expect(firstValueFrom(service.loadPermissions())).rejects.toBe(error);
    expect(storage.setItem).not.toHaveBeenCalled();
    expect(service.hasPermissionSync(Agent.READ)).toBe(false);
  });

  it('propagates deserialization errors without caching permissions', async () => {
    const error = new Error('invalid response');
    storage.getItem.mockReturnValue(null);
    gs.ghelper.mockReturnValue(of(mockResponse()));
    serializer.deserialize.mockImplementation(() => {
      throw error;
    });
    await expect(firstValueFrom(service.loadPermissions())).rejects.toBe(error);
    expect(storage.setItem).not.toHaveBeenCalled();
    expect(service.hasPermissionSync(Agent.READ)).toBe(false);
  });
});
