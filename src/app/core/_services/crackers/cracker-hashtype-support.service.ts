import { HTTP_SKIP_CACHE_HEADER_CONFIG } from '@constants/http.config';
import { zGetHashtypesByIdCrackerBinariesResponse } from '@generated/api/zod';
import { Observable, catchError, map, of } from 'rxjs';

import { HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { DEFAULT_CRACKER_BINARY_TYPE_NAME, JCrackerBinaryType } from '@models/cracker-binary.model';
import { CrackerBinaryId, CrackerBinaryTypeId, HashTypeId } from '@models/id.types';

import { RelationshipType, SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';

/** Ids of the cracker versions supporting a hashtype, null when no hashtype is known and nothing is filtered */
export type SupportedCrackerBinaryIds = ReadonlySet<CrackerBinaryId> | null;

/**
 * Emitted instead of the supporting versions when the lookup failed (e.g. 403 without hashtype read permission).
 * It is empty, so the selection is blocked like for an unsupported hashtype, but the messages say that the check
 * failed instead of claiming that no version supports the hashtype.
 */
export const SUPPORT_LOOKUP_FAILED: ReadonlySet<CrackerBinaryId> = new Set();

/** Cracker types with at least one supported version */
export function filterSupportedCrackerTypes<T extends Pick<JCrackerBinaryType, 'crackerVersions'>>(
  types: T[],
  supported: SupportedCrackerBinaryIds
): T[] {
  if (supported === null) {
    return types;
  }
  return types.filter((type) => type.crackerVersions.some((version) => supported.has(version.id)));
}

/** Supported cracker versions, in their original order */
export function filterSupportedCrackerVersions<T extends { id: CrackerBinaryId }>(
  versions: T[],
  supported: SupportedCrackerBinaryIds
): T[] {
  if (supported === null) {
    return versions;
  }
  return versions.filter((version) => supported.has(version.id));
}

/** Cracker type the task forms preselect: hashcat if available, else the last type */
export function pickDefaultCrackerTypeId(
  types: Pick<JCrackerBinaryType, 'id' | 'typeName'>[]
): CrackerBinaryTypeId | undefined {
  return (types.find((type) => type.typeName === DEFAULT_CRACKER_BINARY_TYPE_NAME) ?? types.at(-1))?.id;
}

/** Explains why no cracker version can be selected for a hashtype: none supports it, or the lookup failed */
export function buildUnsupportedHashtypeMessage(
  hashTypeId: HashTypeId,
  description?: string | null,
  supported?: SupportedCrackerBinaryIds
): string {
  const hashtype = description ? `${hashTypeId} (${description})` : `${hashTypeId}`;
  if (supported === SUPPORT_LOOKUP_FAILED) {
    return `Could not check which cracker versions support hashtype ${hashtype}.`;
  }
  return `No accessible cracker version supports hashtype ${hashtype}.`;
}

/**
 * Looks up which cracker versions support a hashtype, used to block task creation with an unsupported version.
 */
@Injectable({
  providedIn: 'root'
})
export class CrackerHashtypeSupportService {
  private gs = inject(GlobalService);

  /**
   * Ids of the cracker versions supporting the hashtype, filtered by the backend to the access groups of the user.
   * A failed lookup (e.g. 403 without hashtype read permission) emits {@link SUPPORT_LOOKUP_FAILED}, so the selection
   * is blocked; the global HTTP error dialog shows the reason. Unsubscribing cancels the request. The HTTP cache is
   * bypassed: a stale answer would briefly block or unblock the selection.
   */
  getSupportedCrackerBinaryIds(hashTypeId: HashTypeId): Observable<ReadonlySet<CrackerBinaryId>> {
    const headers = new HttpHeaders(HTTP_SKIP_CACHE_HEADER_CONFIG);
    return this.gs.getRelationships(SERV.HASHTYPES, hashTypeId, RelationshipType.CRACKERBINARIES, { headers }).pipe(
      map(
        (response) => new Set(zGetHashtypesByIdCrackerBinariesResponse.parse(response).data.map((binary) => binary.id))
      ),
      catchError((error: unknown) => {
        console.error(`Failed to load the cracker versions supporting hashtype ${hashTypeId}:`, error);
        return of(SUPPORT_LOOKUP_FAILED);
      })
    );
  }
}
