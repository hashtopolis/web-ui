import { ChunkState } from '@constants/chunks.config';
import { of } from 'rxjs';
import type { MockedObject } from 'vitest';

import { Clipboard } from '@angular/cdk/clipboard';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ResponseWrapper } from '@models/response.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';
import { UIConfigService } from '@services/shared/storage.service';

import { ChunkDetailComponent } from '@src/app/tasks/chunk-detail/chunk-detail.component';
import { mockResponse } from '@src/app/testing/mock-response';

describe('ChunkDetailComponent', () => {
  let fixture: ComponentFixture<ChunkDetailComponent>;
  let component: ChunkDetailComponent;
  let gs: MockedObject<GlobalService>;
  let clipboard: MockedObject<Clipboard>;
  let alert: MockedObject<AlertService>;

  beforeEach(async () => {
    gs = { get: vi.fn(), getAll: vi.fn() } as unknown as MockedObject<GlobalService>;
    clipboard = { copy: vi.fn() } as unknown as MockedObject<Clipboard>;
    alert = { showSuccessMessage: vi.fn() } as unknown as MockedObject<AlertService>;
    await TestBed.configureTestingModule({
      imports: [ChunkDetailComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({ id: '12' }) } },
        { provide: GlobalService, useValue: gs },
        { provide: Clipboard, useValue: clipboard },
        { provide: AlertService, useValue: alert },
        { provide: AutoTitleService, useValue: { set: vi.fn() } },
        { provide: UIConfigService, useValue: { getUISettings: () => ({ hashlistAlias: '#HL#' }) } },
        {
          provide: JsonAPISerializer,
          useValue: {
            deserialize: (response: ResponseWrapper) => {
              const resource = response.data as { id: number; attributes: Record<string, unknown> };
              return { id: resource.id, ...resource.attributes };
            }
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    gs.get.mockReturnValue(
      of(
        mockResponse({
          data: {
            id: 12,
            type: 'chunk',
            attributes: {
              taskId: 7,
              skip: 100,
              length: 200,
              state: ChunkState.RUNNING,
              agentId: null,
              dispatchTime: 0,
              solveTime: 0
            }
          }
        })
      )
    );
    gs.getAll.mockReturnValue(of(mockResponse()));
    fixture = TestBed.createComponent(ChunkDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('loads the requested chunk and exposes its derived keyspace values', () => {
    expect(component.chunkId).toBe(12);
    expect(component.chunk?.skip).toBe(100);
    expect(component.chunkEnd).toBe(300);
    expect(component.isActive).toBe(true);
    expect(component.taskKeyspace).toBe(300);
    expect(component.chunkSegment.width).toBeCloseTo((200 / 300) * 100);
    expect(component.isLoading).toBe(false);
  });

  it('builds agent command variant when requested', () => {
    component.setCommandVariant('agent');
    expect(component.commandVariant).toBe('agent');
    expect(component.command).toContain('-s 100 -l 200');
    expect(component.command).toContain('--machine-readable');
  });

  it('reports successful command copies', () => {
    clipboard.copy.mockReturnValue(true);
    component.copyCommand();
    expect(clipboard.copy).toHaveBeenCalledWith(component.command);
    expect(alert.showSuccessMessage).toHaveBeenCalledWith('Command copied to clipboard');
  });
});
