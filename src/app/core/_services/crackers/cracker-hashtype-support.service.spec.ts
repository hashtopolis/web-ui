import { HttpHeaderName } from '@constants/http.config';
import { zGetHashtypesByIdRelationshipsCrackerBinariesResponse } from '@generated/api/zod';
import { firstValueFrom, of, throwError } from 'rxjs';
import type { MockedObject } from 'vitest';

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

import { mockResponse, mockValidResponse } from '@src/app/testing/mock-response';

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
  let gs: MockedObject<GlobalService>;

  beforeEach(() => {
    gs = {
      getRelationshipLink: vi.fn().mockName('GlobalService.getRelationshipLink')
    } as MockedObject<GlobalService>;
    TestBed.configureTestingModule({ providers: [{ provide: GlobalService, useValue: gs }] });
    service = TestBed.inject(CrackerHashtypeSupportService);
  });

  it('returns the ids of the supporting cracker versions', async () => {
    gs.getRelationshipLink.mockReturnValue(
      of(
        mockValidResponse(zGetHashtypesByIdRelationshipsCrackerBinariesResponse, {
          data: [
            { type: 'crackerBinary', id: 5 },
            { type: 'crackerBinary', id: 9 }
          ]
        })
      )
    );

    const ids = await firstValueFrom(service.getSupportedCrackerBinaryIds(1000));

    expect(gs.getRelationshipLink).toHaveBeenCalledWith(
      SERV.HASHTYPES,
      1000,
      RelationshipType.CRACKERBINARIES,
      expect.anything()
    );
    expect([...ids]).toEqual([5, 9]);
  });

  it('bypasses the HTTP cache, a stale answer must not decide about blocking', async () => {
    gs.getRelationshipLink.mockReturnValue(
      of(mockValidResponse(zGetHashtypesByIdRelationshipsCrackerBinariesResponse, { data: [] }))
    );

    await firstValueFrom(service.getSupportedCrackerBinaryIds(1000));

    const options = vi.mocked(gs.getRelationshipLink).mock.lastCall![3] as {
      headers: HttpHeaders;
    };
    expect(options.headers.get(HttpHeaderName.SKIP_CACHE)).toBe('true');
  });

  it('resolves to the empty failure marker on error', async () => {
    vi.spyOn(console, 'error').mockReturnValue(undefined);
    gs.getRelationshipLink.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 403 })));

    const ids = await firstValueFrom(service.getSupportedCrackerBinaryIds(1000));

    expect(ids).toBe(SUPPORT_LOOKUP_FAILED);
    expect(ids.size).toBe(0);
  });

  it('resolves to the empty failure marker when the response is not a relationship link', async () => {
    vi.spyOn(console, 'error').mockReturnValue(undefined);
    gs.getRelationshipLink.mockReturnValue(of(mockResponse({ data: [{ type: 'crackerBinary' }] })));

    const ids = await firstValueFrom(service.getSupportedCrackerBinaryIds(1000));

    expect(ids).toBe(SUPPORT_LOOKUP_FAILED);
  });
});
