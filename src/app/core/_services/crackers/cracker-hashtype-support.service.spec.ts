import { HttpHeaderName } from '@constants/http.config';
import { zGetHashtypesByIdCrackerBinariesResponse } from '@generated/api/zod';
import { firstValueFrom, of, throwError } from 'rxjs';

import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { JCrackerBinaryType } from '@models/cracker-binary.model';

import {
  CrackerHashtypeSupportService,
  SUPPORT_LOOKUP_FAILED,
  buildUnsupportedHashtypeMessage,
  filterSupportedCrackerTypes,
  filterSupportedCrackerVersions,
  pickDefaultCrackerTypeId
} from '@services/crackers/cracker-hashtype-support.service';
import { RelationshipType, SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';

import { mockValidResponse } from '@src/app/testing/mock-response';

function crackerType(id: number, typeName: string, versionIds: number[]): JCrackerBinaryType {
  return {
    id,
    type: 'crackerBinaryType',
    typeName,
    crackerVersions: versionIds.map((versionId) => ({
      id: versionId,
      type: 'crackerBinary',
      binaryName: typeName,
      crackerBinaryTypeId: id,
      downloadUrl: null,
      version: `${versionId}`,
      filename: null,
      accessGroupId: 1
    }))
  };
}

describe('cracker hashtype support helpers', () => {
  const types = [crackerType(1, 'hashcat', [10, 11]), crackerType(2, 'generic', [20])];

  it('keeps everything when no hashtype is known', () => {
    expect(filterSupportedCrackerTypes(types, null)).toEqual(types);
    expect(filterSupportedCrackerVersions(types[0].crackerVersions, null)).toEqual(types[0].crackerVersions);
  });

  it('keeps only types and versions with support', () => {
    const supported = new Set([11]);
    expect(filterSupportedCrackerTypes(types, supported).map((type) => type.id)).toEqual([1]);
    expect(filterSupportedCrackerVersions(types[0].crackerVersions, supported).map((v) => v.id)).toEqual([11]);
    expect(filterSupportedCrackerTypes(types, new Set())).toEqual([]);
  });

  it('prefers the hashcat type, else the last type', () => {
    expect(pickDefaultCrackerTypeId(types)).toBe(1);
    expect(pickDefaultCrackerTypeId([crackerType(2, 'generic', []), crackerType(3, 'other', [])])).toBe(3);
    expect(pickDefaultCrackerTypeId([])).toBeUndefined();
  });

  it('builds the block message with and without description', () => {
    expect(buildUnsupportedHashtypeMessage(1000, 'NTLM')).toBe(
      'No accessible cracker version supports hashtype 1000 (NTLM).'
    );
    expect(buildUnsupportedHashtypeMessage(1000)).toBe('No accessible cracker version supports hashtype 1000.');
    expect(buildUnsupportedHashtypeMessage(1000, null)).toBe('No accessible cracker version supports hashtype 1000.');
  });

  it('says the check failed instead of claiming no support when the lookup failed', () => {
    expect(buildUnsupportedHashtypeMessage(1000, 'NTLM', SUPPORT_LOOKUP_FAILED)).toBe(
      'Could not check which cracker versions support hashtype 1000 (NTLM).'
    );
    expect(buildUnsupportedHashtypeMessage(1000, 'NTLM', new Set())).toBe(
      'No accessible cracker version supports hashtype 1000 (NTLM).'
    );
  });
});

describe('CrackerHashtypeSupportService', () => {
  let service: CrackerHashtypeSupportService;
  let gs: jasmine.SpyObj<GlobalService>;

  beforeEach(() => {
    gs = jasmine.createSpyObj('GlobalService', ['getRelationships']);
    TestBed.configureTestingModule({ providers: [{ provide: GlobalService, useValue: gs }] });
    service = TestBed.inject(CrackerHashtypeSupportService);
  });

  it('returns the ids of the supporting cracker versions', async () => {
    gs.getRelationships.and.returnValue(
      of(
        mockValidResponse(zGetHashtypesByIdCrackerBinariesResponse, {
          data: [
            { type: 'crackerBinary', id: 5 },
            { type: 'crackerBinary', id: 9 }
          ]
        })
      )
    );

    const ids = await firstValueFrom(service.getSupportedCrackerBinaryIds(1000));

    expect(gs.getRelationships).toHaveBeenCalledWith(
      SERV.HASHTYPES,
      1000,
      RelationshipType.CRACKERBINARIES,
      jasmine.anything()
    );
    expect([...ids]).toEqual([5, 9]);
  });

  it('bypasses the HTTP cache, a stale answer must not decide about blocking', async () => {
    gs.getRelationships.and.returnValue(of(mockValidResponse(zGetHashtypesByIdCrackerBinariesResponse, { data: [] })));

    await firstValueFrom(service.getSupportedCrackerBinaryIds(1000));

    const options = gs.getRelationships.calls.mostRecent().args[3] as { headers: HttpHeaders };
    expect(options.headers.get(HttpHeaderName.SKIP_CACHE)).toBe('true');
  });

  it('resolves to the empty failure marker on error', async () => {
    spyOn(console, 'error');
    gs.getRelationships.and.returnValue(throwError(() => new HttpErrorResponse({ status: 403 })));

    const ids = await firstValueFrom(service.getSupportedCrackerBinaryIds(1000));

    expect(ids).toBe(SUPPORT_LOOKUP_FAILED);
    expect(ids.size).toBe(0);
  });
});
