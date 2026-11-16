import { zChunkResponse, zHashlistResponse, zTaskResponse } from '@generated/api/zod';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import type { MockedObject } from 'vitest';

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Data, Params, Router, RouterLink, provideRouter } from '@angular/router';

import { ResponseWrapper } from '@models/response.model';
import { HashesRouteKind } from '@models/routes.schema';

import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

import { HashesViewType } from '@src/app/core/_constants/hashes.config';
import { HashesComponent } from '@src/app/hashlists/hashes/hashes.component';
import { mockResponse, mockValidResponse } from '@src/app/testing/mock-response';

@Component({
  selector: 'grid-main',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
class MockGridMainComponent {}

@Component({
  selector: 'app-table',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
class MockTableComponent {}

@Component({
  selector: 'app-hexconvertor',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
class MockHexconvertorComponent {}

@Component({
  selector: 'hashes-table',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
class MockHashesTableComponent {
  @Input() id: number;
  @Input() dataType: string;
  @Input() filterParam: string;
}

// Fixtures
const mockChunkResponse = (id = 7): ResponseWrapper =>
  mockValidResponse(zChunkResponse, {
    data: {
      id,
      type: 'chunk',
      attributes: {
        taskId: 1,
        skip: 0,
        length: 100,
        agentId: null,
        dispatchTime: 0,
        solveTime: 0,
        checkpoint: 0,
        progress: 0,
        state: 0,
        cracked: 0,
        speed: 0
      }
    }
  });

const taskAttributes = {
  taskName: 'My Task',
  attackCmd: '#HL# -a 0',
  chunkTime: 600,
  statusTimer: 5,
  keyspace: 0,
  keyspaceProgress: 0,
  priority: 0,
  maxAgents: 0,
  color: null,
  isSmall: false,
  isCpuTask: false,
  useNewBench: false,
  skipKeyspace: 0,
  crackerBinaryId: 1,
  crackerBinaryTypeId: null,
  taskWrapperId: 1,
  isArchived: false,
  notes: '',
  staticChunks: 0,
  chunkSize: 0,
  forcePipe: false,
  preprocessorId: 0,
  preprocessorCommand: ''
};

const mockTaskResponse = (attributes: Record<string, unknown> = taskAttributes): ResponseWrapper =>
  mockValidResponse(zTaskResponse, { data: { id: 3, type: 'task', attributes } });

const mockHashlistResponse = (): ResponseWrapper =>
  mockValidResponse(zHashlistResponse, {
    data: {
      id: 5,
      type: 'hashlist',
      attributes: {
        name: 'My Hashlist',
        notes: '',
        isSecret: false,
        useBrain: false,
        format: 0,
        hashTypeId: 0,
        hashCount: 10,
        cracked: 2,
        separator: ':',
        isHexSalt: false,
        isSalted: false,
        accessGroupId: 1,
        brainFeatures: 0,
        isArchived: false
      }
    }
  });

describe('HashesComponent', () => {
  let component: HashesComponent;
  let fixture: ComponentFixture<HashesComponent>;

  // Mocks
  let globalServiceSpy: MockedObject<GlobalService>;
  let titleServiceSpy: MockedObject<AutoTitleService>;
  let params$: BehaviorSubject<Params>;
  let data$: BehaviorSubject<Data>;

  const createComponent = (params: Params, data: Data): void => {
    params$ = new BehaviorSubject<Params>(params);
    data$ = new BehaviorSubject<Data>(data);
    fixture = TestBed.createComponent(HashesComponent);
    component = fixture.componentInstance;
  };

  const headerText = (): string =>
    (fixture.nativeElement.querySelector('h2')?.textContent ?? '').replace(/\s+/g, ' ').trim();

  beforeEach(async () => {
    globalServiceSpy = {
      get: vi.fn().mockName('GlobalService.get')
    } as MockedObject<GlobalService>;
    titleServiceSpy = {
      set: vi.fn().mockName('AutoTitleService.set')
    } as MockedObject<AutoTitleService>;

    globalServiceSpy.get.mockImplementation((endpoint: { URL: string }): Observable<ResponseWrapper> => {
      switch (endpoint) {
        case SERV.CHUNKS:
          return of(mockChunkResponse());
        case SERV.TASKS:
          return of(mockTaskResponse());
        case SERV.HASHLISTS:
          return of(mockHashlistResponse());
        default:
          throw new Error(`Unexpected API endpoint: ${endpoint.URL}`);
      }
    });

    await TestBed.configureTestingModule({
      imports: [RouterLink],
      declarations: [
        HashesComponent,
        MockGridMainComponent,
        MockTableComponent,
        MockHexconvertorComponent,
        MockHashesTableComponent
      ],
      providers: [
        { provide: GlobalService, useValue: globalServiceSpy },
        { provide: AutoTitleService, useValue: titleServiceSpy },
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useFactory: (router: Router): Pick<ActivatedRoute, 'params' | 'data' | 'snapshot'> => ({
            params: params$.asObservable(),
            data: data$.asObservable(),
            snapshot: router.routerState.snapshot.root
          }),
          deps: [Router]
        }
      ]
    }).compileComponents();
  });

  describe('initial state', () => {
    it('should create the component and set the page title', () => {
      createComponent({ id: '1' }, { kind: HashesRouteKind.HashlistHashes });

      expect(component).toBeInstanceOf(HashesComponent);
      expect(titleServiceSpy.set).toHaveBeenCalledExactlyOnceWith(['Show Hashes']);
      expect(component.editMode).toBe(false);
    });

    it('should not load anything before ngOnInit', () => {
      createComponent({ id: '1' }, { kind: HashesRouteKind.HashlistHashes });

      expect(globalServiceSpy.get).not.toHaveBeenCalled();
      expect(component.whichView).toBeUndefined();
    });
  });

  describe('loadHashes', () => {
    it('should load a chunk and use its id as title', () => {
      createComponent({ id: '7' }, { kind: HashesRouteKind.ChunkHashes });

      fixture.detectChanges();

      expect(component.editedIndex).toBe(7);
      expect(component.whichView).toBe(HashesViewType.CHUNKS);
      expect(globalServiceSpy.get).toHaveBeenCalledExactlyOnceWith(SERV.CHUNKS, 7);
      expect(component.titleName).toBe('7');
      expect(headerText()).toBe('Hashes of chunk 7');
    });

    it('should load a task and use its taskName as title', () => {
      createComponent({ id: '3' }, { kind: HashesRouteKind.TaskHashes });

      fixture.detectChanges();

      expect(component.editedIndex).toBe(3);
      expect(component.whichView).toBe(HashesViewType.TASKS);
      expect(globalServiceSpy.get).toHaveBeenCalledExactlyOnceWith(SERV.TASKS, 3);
      expect(component.titleName).toBe('My Task');
      expect(headerText()).toBe('Hashes of task My Task');
    });

    it('should load a hashlist and use its name as title', () => {
      createComponent({ id: '5' }, { kind: HashesRouteKind.HashlistHashes });

      fixture.detectChanges();

      expect(component.editedIndex).toBe(5);
      expect(component.whichView).toBe(HashesViewType.HASHLISTS);
      expect(globalServiceSpy.get).toHaveBeenCalledExactlyOnceWith(SERV.HASHLISTS, 5);
      expect(component.titleName).toBe('My Hashlist');
      expect(headerText()).toBe('Hashes of hashlist My Hashlist');
    });

    it('should pass id, view type and filter to the hashes table', () => {
      createComponent({ id: '5?cracked' }, { kind: HashesRouteKind.HashlistHashes });

      fixture.detectChanges();

      const table = fixture.debugElement.query(By.directive(MockHashesTableComponent))
        .componentInstance as MockHashesTableComponent;
      expect(table.id).toBe(5);
      expect(table.dataType).toBe(HashesViewType.HASHLISTS);
      expect(table.filterParam).toBe('cracked');
    });

    it.each([
      [HashesRouteKind.ChunkHashes, '7', '/tasks/show-tasks/7/edit'],
      [HashesRouteKind.TaskHashes, '3', '/tasks/show-tasks/3/edit'],
      [HashesRouteKind.HashlistHashes, '5', '/hashlists/hashlist/5/edit']
    ])('should bind the title anchor for "%s"', (kind, id, expectedHref) => {
      createComponent({ id }, { kind });

      fixture.detectChanges();

      const link = fixture.nativeElement.querySelector('h2 a') as HTMLAnchorElement | null;
      expect(link?.getAttribute('href')).toBe(expectedHref);
    });

    it('should react to new route params and data emissions', () => {
      createComponent({ id: '5' }, { kind: HashesRouteKind.HashlistHashes });
      fixture.detectChanges();

      params$.next({ id: '9' });
      data$.next({ kind: HashesRouteKind.TaskHashes });
      fixture.detectChanges();

      expect(component.editedIndex).toBe(9);
      expect(component.whichView).toBe(HashesViewType.TASKS);
      expect(globalServiceSpy.get).toHaveBeenLastCalledWith(SERV.TASKS, 9);
      expect(component.titleName).toBe('My Task');
    });
  });

  describe('edge Cases', () => {
    it('should parse the filter parameter appended to the id', () => {
      createComponent({ id: '12?uncracked' }, { kind: HashesRouteKind.TaskHashes });

      fixture.detectChanges();

      expect(component.editedIndex).toBe(12);
      expect(component.filterParam).toBe('uncracked');
    });

    it('should leave filterParam undefined when no filter is given', () => {
      createComponent({ id: '12' }, { kind: HashesRouteKind.TaskHashes });

      fixture.detectChanges();

      expect(component.filterParam).toBeUndefined();
    });

    it('should leave filterParam undefined for an empty filter after "?"', () => {
      createComponent({ id: '12?' }, { kind: HashesRouteKind.TaskHashes });

      fixture.detectChanges();

      expect(component.editedIndex).toBe(12);
      expect(component.filterParam).toBeUndefined();
    });

    it('should accept the minimal valid id 1', () => {
      createComponent({ id: '1' }, { kind: HashesRouteKind.ChunkHashes });
      globalServiceSpy.get.mockReturnValue(of(mockChunkResponse(1)));

      fixture.detectChanges();

      expect(component.editedIndex).toBe(1);
      expect(component.titleName).toBe('1');
    });

    it('should fall back to an empty title when the task has no taskName', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
      vi.spyOn(console, 'log').mockImplementation(() => undefined);
      const { taskName: _omit, ...withoutName } = taskAttributes;
      const invalidTaskResponse = mockResponse({ data: { id: 3, type: 'task', attributes: withoutName } });
      globalServiceSpy.get.mockReturnValue(of(invalidTaskResponse));
      createComponent({ id: '3' }, { kind: HashesRouteKind.TaskHashes });

      fixture.detectChanges();

      expect(component.titleName).toBe('');
      expect(consoleErrorSpy).toHaveBeenCalledExactlyOnceWith('API response validation failed', expect.anything());
    });

    it('should not set a title while the API request is still pending', () => {
      const pending$ = new Subject<ResponseWrapper>();
      globalServiceSpy.get.mockReturnValue(pending$.asObservable());
      createComponent({ id: '5' }, { kind: HashesRouteKind.HashlistHashes });

      fixture.detectChanges();

      expect(component.whichView).toBe(HashesViewType.HASHLISTS);
      expect(component.titleName).toBeUndefined();

      pending$.next(mockHashlistResponse());

      expect(component.titleName).toBe('My Hashlist');
    });

    it('should unsubscribe from all streams when destroyed', () => {
      const pending$ = new Subject<ResponseWrapper>();
      globalServiceSpy.get.mockReturnValue(pending$.asObservable());
      createComponent({ id: '5' }, { kind: HashesRouteKind.HashlistHashes });
      fixture.detectChanges();

      fixture.destroy();
      params$.next({ id: '99' });
      pending$.next(mockHashlistResponse());

      expect(params$.observed).toBe(false);
      expect(data$.observed).toBe(false);
      expect(pending$.observed).toBe(false);
      expect(component.editedIndex).toBe(5);
      expect(component.titleName).toBeUndefined();
    });
  });

  describe('error cases', () => {
    it('should report a schema validation error for an invalid API response', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
      vi.spyOn(console, 'log').mockImplementation(() => undefined);
      globalServiceSpy.get.mockReturnValue(of(mockResponse({ data: { id: 5, type: 'hashlist', attributes: {} } })));
      createComponent({ id: '5' }, { kind: HashesRouteKind.HashlistHashes });

      fixture.detectChanges();

      expect(consoleErrorSpy).toHaveBeenCalledExactlyOnceWith('API response validation failed', expect.anything());
      expect(component.titleName).toBeUndefined();
    });
  });
});
