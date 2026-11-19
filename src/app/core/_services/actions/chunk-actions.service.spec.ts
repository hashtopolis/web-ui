import { ChunkState } from '@constants/chunks.config';
import { firstValueFrom, of } from 'rxjs';
import type { MockedObject } from 'vitest';

import { TestBed } from '@angular/core/testing';

import { JChunk } from '@models/chunk.model';

import { ChunkActionsService } from '@services/actions/chunk-actions.service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';

import { mockResponse } from '@src/app/testing/mock-response';

describe('ChunkActionsService', () => {
  let service: ChunkActionsService;
  let gsSpy: MockedObject<GlobalService>;

  beforeEach(() => {
    gsSpy = {
      chelper: vi.fn().mockName('GlobalService.chelper')
    } as MockedObject<GlobalService>;
    gsSpy.chelper.mockReturnValue(of(mockResponse()));

    TestBed.configureTestingModule({
      providers: [
        { provide: GlobalService, useValue: gsSpy },
        { provide: AlertService, useValue: { showErrorMessage: vi.fn().mockName('AlertService.showErrorMessage') } }
      ]
    });
    service = TestBed.inject(ChunkActionsService);
  });

  describe('resetChunk', () => {
    it('requests abortChunk for an active chunk (AUTOTUNE)', async () => {
      await firstValueFrom(service.resetChunk({ id: 5, state: ChunkState.AUTOTUNE } as JChunk), {
        defaultValue: undefined
      });

      expect(gsSpy.chelper).toHaveBeenCalledExactlyOnceWith(SERV.HELPER, 'abortChunk', { chunkId: 5 });
    });

    it('requests resetChunk for an inactive chunk (INIT)', async () => {
      await firstValueFrom(service.resetChunk({ id: 5, state: ChunkState.INIT } as JChunk), {
        defaultValue: undefined
      });

      expect(gsSpy.chelper).toHaveBeenCalledExactlyOnceWith(SERV.HELPER, 'resetChunk', { chunkId: 5 });
    });
  });
});
