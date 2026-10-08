import { zCrackerBinaryTypeListResponse } from '@generated/api/zod';
import { Observable, catchError, map, of, shareReplay } from 'rxjs';

import { Injectable, inject } from '@angular/core';

import { JCrackerBinaryType } from '@models/cracker-binary.model';
import { CrackerBinaryTypeId } from '@models/id.types';
import { ResponseWrapper } from '@models/response.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';

/** Id and name of a cracker binary type, without its versions */
export interface CrackerBinaryTypeName {
  id: CrackerBinaryTypeId;
  typeName: string;
}

/** Name shown for a cracker binary type the type list does not contain, or when the list could not be loaded */
export function fallbackCrackerTypeName(id: CrackerBinaryTypeId): string {
  return `Type #${id}`;
}

/**
 * Cracker binary types for the whole session. Types only change when an admin creates or deletes one, so the list
 * is loaded once and invalidated at those places. Sits above the HTTP stale-while-revalidate cache, which only
 * keeps repeated loads cheap for a minute; this service keeps the list stable and gives every consumer the same
 * name lookup.
 */
@Injectable({
  providedIn: 'root'
})
export class CrackerBinaryTypesService {
  private gs = inject(GlobalService);

  /** Cached list, null until the first request (and again after invalidate or a failed request) */
  private types$: Observable<CrackerBinaryTypeName[]> | null = null;

  /** All cracker binary types. Errors propagate to the caller (the global HTTP error dialog shows them). */
  getTypes(): Observable<CrackerBinaryTypeName[]> {
    if (this.types$ === null) {
      this.types$ = this.gs.getAll(SERV.CRACKERS_TYPES).pipe(
        map((response: ResponseWrapper) => {
          const types: Pick<JCrackerBinaryType, 'id' | 'typeName'>[] = new JsonAPISerializer().deserialize(
            response,
            zCrackerBinaryTypeListResponse
          );
          return types.map((type) => ({ id: type.id, typeName: type.typeName }));
        }),
        catchError((error: unknown) => {
          // the next subscriber retries
          this.types$ = null;
          throw error;
        }),
        shareReplay({ bufferSize: 1, refCount: false })
      );
    }
    return this.types$;
  }

  /** Type names by id. A failed request gives an empty map, a name lookup must not fail a page. */
  getTypeNames(): Observable<ReadonlyMap<CrackerBinaryTypeId, string>> {
    return this.getTypes().pipe(
      map((types) => new Map<CrackerBinaryTypeId, string>(types.map((type) => [type.id, type.typeName]))),
      catchError((error: unknown) => {
        console.error('Failed to load the cracker binary types:', error);
        return of(new Map<CrackerBinaryTypeId, string>());
      })
    );
  }

  /** Name of one type, `Type #<id>` if unknown or not loadable */
  getTypeName(id: CrackerBinaryTypeId): Observable<string> {
    return this.getTypeNames().pipe(map((names) => names.get(id) ?? fallbackCrackerTypeName(id)));
  }

  /** Drop the cached list, called after a cracker binary type was created or deleted */
  invalidate(): void {
    this.types$ = null;
  }
}
