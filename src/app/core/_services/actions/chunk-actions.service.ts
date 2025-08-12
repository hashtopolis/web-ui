import { EMPTY, Observable, catchError } from 'rxjs';

import { Injectable } from '@angular/core';

import { JChunk } from '@models/chunk.model';

import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';

@Injectable({ providedIn: 'root' })
export class ChunkActionsService {
  constructor(
    private gs: GlobalService,
    private alertService: AlertService
  ) {}

  /**
   * Resets or aborts a chunk based on its current state.
   *
   * If the chunk's state is `2` (in-progress), the request will abort it.
   * Otherwise, the request will reset it to its initial state.
   *
   * @param chunk The chunk to reset or abort.
   * @returns An Observable that completes when the operation finishes.
   *          Emits no value. Handles errors internally by logging and showing
   *          an error message via AlertService.
   */
  resetChunk(chunk: JChunk): Observable<void> {
    const path = chunk.state === 2 ? 'abortChunk' : 'resetChunk';
    const payload = { chunkId: chunk.id };

    return this.gs.chelper(SERV.HELPER, path, payload).pipe(
      catchError((error) => {
        const errorMessage = 'Error during resetting';
        console.error(errorMessage, error);
        this.alertService.showErrorMessage(errorMessage);
        return EMPTY;
      })
    );
  }
}
