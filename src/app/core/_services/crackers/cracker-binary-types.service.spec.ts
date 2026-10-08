import { zCrackerBinaryTypeListResponse } from '@generated/api/zod';
import { firstValueFrom, of, throwError } from 'rxjs';

import { TestBed } from '@angular/core/testing';

import { CrackerBinaryTypesService, fallbackCrackerTypeName } from '@services/crackers/cracker-binary-types.service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';

import { mockValidResponse } from '@src/app/testing/mock-response';

const TYPES = mockValidResponse(zCrackerBinaryTypeListResponse, {
  data: [
    { id: 1, type: 'crackerBinaryType', attributes: { typeName: 'hashcat', isChunkingAvailable: true } },
    { id: 2, type: 'crackerBinaryType', attributes: { typeName: 'generic', isChunkingAvailable: true } }
  ]
});

describe('CrackerBinaryTypesService', () => {
  let service: CrackerBinaryTypesService;
  let gs: jasmine.SpyObj<GlobalService>;

  beforeEach(() => {
    gs = jasmine.createSpyObj('GlobalService', ['getAll']);
    gs.getAll.and.returnValue(of(TYPES));
    TestBed.configureTestingModule({ providers: [{ provide: GlobalService, useValue: gs }] });
    service = TestBed.inject(CrackerBinaryTypesService);
  });

  it('loads the types once for several subscribers', async () => {
    const first = await firstValueFrom(service.getTypes());
    const second = await firstValueFrom(service.getTypes());

    expect(gs.getAll).toHaveBeenCalledOnceWith(SERV.CRACKERS_TYPES);
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
    gs.getAll.and.returnValues(
      throwError(() => new Error('down')),
      of(TYPES)
    );

    await expectAsync(firstValueFrom(service.getTypes())).toBeRejected();
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
    spyOn(console, 'error');
    gs.getAll.and.returnValue(throwError(() => new Error('down')));

    expect(await firstValueFrom(service.getTypeName(1))).toBe('Type #1');
    expect((await firstValueFrom(service.getTypeNames())).size).toBe(0);
  });
});
