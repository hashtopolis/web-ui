import { ChunkState } from '@constants/chunks.config';

import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { JChunk } from '@models/chunk.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';
import { UIConfigService } from '@services/shared/storage.service';

import { ChunkDetailComponent } from '@src/app/tasks/chunk-detail/chunk-detail.component';

describe('ChunkDetailComponent', () => {
  let component: ChunkDetailComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChunkDetailComponent],
      providers: [
        { provide: ActivatedRoute, useValue: {} },
        { provide: GlobalService, useValue: {} },
        { provide: JsonAPISerializer, useValue: {} },
        { provide: AlertService, useValue: {} },
        { provide: AutoTitleService, useValue: {} },
        { provide: UIConfigService, useValue: {} }
      ]
    })
      .overrideComponent(ChunkDetailComponent, { set: { template: '', imports: [] } })
      .compileComponents();

    // No change detection, so ngOnInit does not load anything; the tests set the chunk directly.
    component = TestBed.createComponent(ChunkDetailComponent).componentInstance;
  });

  describe('isActive', () => {
    it('is true for an active chunk (AUTOTUNE)', () => {
      component.chunk = { state: ChunkState.AUTOTUNE } as JChunk;

      expect(component.isActive).toBe(true);
    });

    it('is false for an inactive chunk (INIT)', () => {
      component.chunk = { state: ChunkState.INIT } as JChunk;

      expect(component.isActive).toBe(false);
    });

    it('is false before the chunk has loaded', () => {
      expect(component.isActive).toBe(false);
    });
  });
});
