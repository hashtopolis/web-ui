import { Perm } from '@constants/userpermissions.config';
import { zCrackerBinaryTypeListResponse } from '@generated/api/zod';
import { firstValueFrom, of, throwError } from 'rxjs';
import type { MockedObject } from 'vitest';

import { TestBed } from '@angular/core/testing';

import { CrackerBinaryTypesService, fallbackCrackerTypeName } from '@services/crackers/cracker-binary-types.service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { PermissionService } from '@services/permission/permission.service';

import { mockValidResponse } from '@src/app/testing/mock-response';

const TYPES = mockValidResponse(zCrackerBinaryTypeListResponse, {
  data: [
    { id: 1, type: 'crackerBinaryType', attributes: { typeName: 'hashcat', isChunkingAvailable: true } },
    { id: 2, type: 'crackerBinaryType', attributes: { typeName: 'generic', isChunkingAvailable: true } }
  ]
});

describe('CrackerBinaryTypesService', () => {
  let service: CrackerBinaryTypesService;
  let gs: MockedObject<GlobalService>;
  let granted: Set<string>;

  beforeEach(() => {
    gs = {
      getAll: vi.fn().mockName('GlobalService.getAll')
    } as MockedObject<GlobalService>;
    gs.getAll.mockReturnValue(of(TYPES));
    granted = new Set<string>([Perm.CrackerBinaryType.READ]);
    const permissionService = {
      hasPermissionSync: vi.fn().mockName('PermissionService.hasPermissionSync')
    };
    permissionService.hasPermissionSync.mockImplementation((key) => granted.has(key));
    TestBed.configureTestingModule({
      providers: [
        { provide: GlobalService, useValue: gs },
        { provide: PermissionService, useValue: permissionService }
      ]
    });
    service = TestBed.inject(CrackerBinaryTypesService);
  });

  it('loads the types once for several subscribers', async () => {
    const first = await firstValueFrom(service.getTypes());
    const second = await firstValueFrom(service.getTypes());

    expect(gs.getAll).toHaveBeenCalledTimes(1);

    expect(gs.getAll).toHaveBeenCalledWith(SERV.CRACKERS_TYPES);
    expect(first).toEqual([
      { id: 1, typeName: 'hashcat' },
      { id: 2, typeName: 'generic' }
    ]);
    expect(second).toEqual(first);
  });

  it('requests the types again after invalidate', async () => {
    await firstValueFrom(service.getTypes());
    service.invalidate();
    await firstValueFrom(service.getTypes());

    expect(gs.getAll).toHaveBeenCalledTimes(2);
  });

  it('retries after a failed request', async () => {
    gs.getAll.mockReturnValueOnce(throwError(() => new Error('down'))).mockReturnValueOnce(of(TYPES));

    await expect(firstValueFrom(service.getTypes())).rejects.toThrow();
    const types = await firstValueFrom(service.getTypes());

    expect(types.map((type) => type.id)).toEqual([1, 2]);
    expect(gs.getAll).toHaveBeenCalledTimes(2);
  });

  it('maps ids to names', async () => {
    const names = await firstValueFrom(service.getTypeNames());
    expect(names.get(1)).toBe('hashcat');
    expect(names.get(2)).toBe('generic');
  });

  it('resolves a type name and falls back for unknown ids', async () => {
    expect(await firstValueFrom(service.getTypeName(1))).toBe('hashcat');
    expect(await firstValueFrom(service.getTypeName(9))).toBe('Type #9');
    expect(fallbackCrackerTypeName(9)).toBe('Type #9');
  });

  it('falls back when the request fails', async () => {
    vi.spyOn(console, 'error').mockReturnValue(undefined);
    gs.getAll.mockReturnValue(throwError(() => new Error('down')));

    expect(await firstValueFrom(service.getTypeName(1))).toBe('Type #1');
    expect((await firstValueFrom(service.getTypeNames())).size).toBe(0);
  });

  it('gives no names without the type read permission and does not request them', async () => {
    granted.clear();

    expect((await firstValueFrom(service.getTypeNames())).size).toBe(0);
    expect(gs.getAll).not.toHaveBeenCalled();
  });

  it('falls back for a type name without the type read permission', async () => {
    granted.clear();

    expect(await firstValueFrom(service.getTypeName(1))).toBe('Type #1');
    expect(gs.getAll).not.toHaveBeenCalled();
  });

  it('still requests the types without the type read permission', async () => {
    granted.clear();

    await firstValueFrom(service.getTypes());

    expect(gs.getAll).toHaveBeenCalledTimes(1);

    expect(gs.getAll).toHaveBeenCalledWith(SERV.CRACKERS_TYPES);
  });
});
