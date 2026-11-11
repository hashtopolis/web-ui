import { ChunkState } from '@constants/chunks.config';
import { SERV } from '@services/main.config';
import { of } from 'rxjs';
import type { MockedObject } from 'vitest';

import { Clipboard } from '@angular/cdk/clipboard';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ResponseWrapper } from '@models/response.model';
import { FilterType } from '@models/request-params.model';

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
    gs = {
      get: vi.fn().mockName('GlobalService.get'),
      getAll: vi.fn().mockName('GlobalService.getAll')
    } as MockedObject<GlobalService>;
    clipboard = { copy: vi.fn().mockName('Clipboard.copy') } as MockedObject<Clipboard>;
    alert = { showSuccessMessage: vi.fn().mockName('AlertService.showSuccessMessage') } as MockedObject<AlertService>;
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
              if (Array.isArray(response.data)) return [];
              const resource = response.data as { id: number; attributes: Record<string, unknown> };
              return { id: resource.id, ...resource.attributes };
            }
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    const chunk = mockResponse({
      data: {
        id: 12,
        type: 'chunk',
        attributes: {
          taskId: 7,
          skip: 100,
          length: 200,
          state: ChunkState.RUNNING,
          agentId: 5,
          dispatchTime: 1000,
          solveTime: 1100
        }
      }
    });
    const task = mockResponse({
      data: {
        id: 7,
        type: 'task',
        attributes: {
          keyspace: 1000,
          keyspaceProgress: 250,
          attackCmd: '-a 0 #HL# words.txt',
          hashlistId: 8,
          hashTypeId: 0
        }
      }
    });
    gs.get.mockImplementation((serviceConfig) => of(serviceConfig === SERV.TASKS ? task : chunk));
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
    expect(component.taskKeyspace).toBe(1000);
    expect(component.chunkSegment.width).toBe(20);
    expect(component.speeds).toStrictEqual([]);
    expect(component.isLoading).toBe(false);
    expect(gs.get).toHaveBeenNthCalledWith(1, SERV.CHUNKS, 12, { include: ['task', 'agent'] });
    expect(gs.get).toHaveBeenNthCalledWith(2, SERV.TASKS, 7, { include: ['hashlist', 'crackerBinary', 'files'] });
    expect(gs.getAll).toHaveBeenCalledExactlyOnceWith(SERV.SPEEDS, {
      filter: [
        { field: 'taskId', operator: FilterType.EQUAL, value: 7 },
        { field: 'agentId', operator: FilterType.EQUAL, value: 5 },
        { field: 'time', operator: FilterType.GREATER, value: 990 },
        { field: 'time', operator: FilterType.LESSER, value: 1110 }
      ],
      sort: ['time'],
      page: { size: 2000 }
    });
  });

  it('builds agent command variant when requested', () => {
    component.setCommandVariant('agent');
    expect(component.commandVariant).toBe('agent');
    expect(component.command).toContain('-s 100 -l 200');
    expect(component.command).toContain('--machine-readable');
    component.setCommandVariant('standalone');
    expect(component.command).not.toContain('--machine-readable');
    expect(component.command).toContain('-s 100 -l 200');
  });

  it('reports successful command copies', () => {
    clipboard.copy.mockReturnValue(true);
    component.copyCommand();
    expect(clipboard.copy).toHaveBeenCalledExactlyOnceWith(component.command);
    expect(alert.showSuccessMessage).toHaveBeenCalledExactlyOnceWith('Command copied to clipboard');
  });

  describe('isActive', () => {
    it('is true for an active chunk (AUTOTUNE)', () => {
      component.chunk = { state: ChunkState.AUTOTUNE } as ChunkDetailComponent['chunk'];

      expect(component.isActive).toBe(true);
    });

    it('is false for an inactive chunk (INIT)', () => {
      component.chunk = { state: ChunkState.INIT } as ChunkDetailComponent['chunk'];

      expect(component.isActive).toBe(false);
    });

    it('is false before the chunk has loaded', () => {
      component.chunk = undefined;

      expect(component.isActive).toBe(false);
    });
  });
});
