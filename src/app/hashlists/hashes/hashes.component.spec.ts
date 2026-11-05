import { zChunkResponse, zHashlistResponse, zTaskResponse } from '@generated/api/zod';
import { BehaviorSubject, Observable, Subject, config, of, throwError } from 'rxjs';
import type { MockedObject } from 'vitest';

import { ChangeDetectionStrategy, Component, Directive, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Data, Params } from '@angular/router';

import { ResponseWrapper } from '@models/response.model';
import { HashesRouteKind } from '@models/routes.schema';

import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';
import '@services/storage/local-storage';

import { HashesViewType } from '@src/app/core/_constants/hashes.config';
import { HashesComponent } from '@src/app/hashlists/hashes/hashes.component';
import { mockResponse, mockValidResponse } from '@src/app/testing/mock-response';

// Mock components for child selectors used in the template
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

@Directive({
  selector: '[routerLink]',
  standalone: false
})
class MockRouterLinkDirective {
  @Input() routerLink: (string | number)[];
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
  let alertServiceSpy: MockedObject<AlertService>;
  let params$: BehaviorSubject<Params>;
  let data$: BehaviorSubject<Data>;
  let unhandledErrors: unknown[];
  let originalOnUnhandledError: typeof config.onUnhandledError;

  const createComponent = (params: Params, data: Data): void => {
    params$ = new BehaviorSubject<Params>(params);
    data$ = new BehaviorSubject<Data>(data);
    const activatedRouteStub = {
      params: params$.asObservable(),
      data: data$.asObservable()
    } as unknown as ActivatedRoute;
    TestBed.overrideProvider(ActivatedRoute, { useValue: activatedRouteStub });

    fixture = TestBed.createComponent(HashesComponent);
    component = fixture.componentInstance;
  };

  const flushUnhandledErrors = (): Promise<void> => new Promise((resolve) => setTimeout(resolve));

  const headerText = (): string =>
    (fixture.nativeElement.querySelector('h2')?.textContent ?? '').replace(/\s+/g, ' ').trim();

  beforeEach(async () => {
    unhandledErrors = [];
    originalOnUnhandledError = config.onUnhandledError;
    config.onUnhandledError = (err: unknown) => unhandledErrors.push(err);

    globalServiceSpy = {
      get: vi.fn().mockName('GlobalService.get')
    } as unknown as MockedObject<GlobalService>;
    titleServiceSpy = {
      set: vi.fn().mockName('AutoTitleService.set')
    } as unknown as MockedObject<AutoTitleService>;
    alertServiceSpy = {
      showSuccessMessage: vi.fn().mockName('AlertService.showSuccessMessage'),
      showErrorMessage: vi.fn().mockName('AlertService.showErrorMessage')
    } as unknown as MockedObject<AlertService>;

    globalServiceSpy.get.mockImplementation((endpoint: { URL: string }): Observable<ResponseWrapper> => {
      switch (endpoint) {
        case SERV.CHUNKS:
          return of(mockChunkResponse());
        case SERV.TASKS:
          return of(mockTaskResponse());
        case SERV.HASHLISTS:
          return of(mockHashlistResponse());
        default:
          return of(mockResponse());
      }
    });

    await TestBed.configureTestingModule({
      declarations: [
        HashesComponent,
        MockGridMainComponent,
        MockTableComponent,
        MockHexconvertorComponent,
        MockHashesTableComponent,
        MockRouterLinkDirective
      ],
      providers: [
        { provide: GlobalService, useValue: globalServiceSpy },
        { provide: AutoTitleService, useValue: titleServiceSpy },
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();
  });

  afterEach(() => {
    config.onUnhandledError = originalOnUnhandledError;
    vi.restoreAllMocks();
  });

  describe('initial state', () => {
    it('should create the component and set the page title', () => {
      createComponent({ id: '1' }, { kind: HashesRouteKind.HashlistHashes });

      expect(component).toBeTruthy();
      expect(titleServiceSpy.set).toHaveBeenCalledWith(['Show Hashes']);
      expect(component.editMode).toBe(false);
    });

    it('should not load anything before ngOnInit', () => {
      createComponent({ id: '1' }, { kind: HashesRouteKind.HashlistHashes });

      expect(globalServiceSpy.get).not.toHaveBeenCalled();
      expect(component.whichView).toBeUndefined();
    });

    it('ngOnInit should delegate to loadHashes', () => {
      createComponent({ id: '1' }, { kind: HashesRouteKind.HashlistHashes });
      const loadSpy = vi.spyOn(component, 'loadHashes');

      component.ngOnInit();

      expect(loadSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('loadHashes', () => {
    it('should load a chunk and use its id as title', () => {
      createComponent({ id: '7' }, { kind: HashesRouteKind.ChunkHashes });

      fixture.detectChanges();

      expect(component.editedIndex).toBe(7);
      expect(component.whichView).toBe(HashesViewType.CHUNKS);
      expect(globalServiceSpy.get).toHaveBeenCalledWith(SERV.CHUNKS, 7);
      expect(component.titleName).toBe('7');
      expect(headerText()).toBe('Hashes of chunk 7');
    });

    it('should load a task and use its taskName as title', () => {
      createComponent({ id: '3' }, { kind: HashesRouteKind.TaskHashes });

      fixture.detectChanges();

      expect(component.editedIndex).toBe(3);
      expect(component.whichView).toBe(HashesViewType.TASKS);
      expect(globalServiceSpy.get).toHaveBeenCalledWith(SERV.TASKS, 3);
      expect(component.titleName).toBe('My Task');
      expect(headerText()).toBe('Hashes of task My Task');
    });

    it('should load a hashlist and use its name as title', () => {
      createComponent({ id: '5' }, { kind: HashesRouteKind.HashlistHashes });

      fixture.detectChanges();

      expect(component.editedIndex).toBe(5);
      expect(component.whichView).toBe(HashesViewType.HASHLISTS);
      expect(globalServiceSpy.get).toHaveBeenCalledWith(SERV.HASHLISTS, 5);
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

    it('should bind the computed router link to the title anchor', () => {
      createComponent({ id: '5' }, { kind: HashesRouteKind.HashlistHashes });

      fixture.detectChanges();

      const link = fixture.debugElement
        .query(By.directive(MockRouterLinkDirective))
        .injector.get(MockRouterLinkDirective);
      expect(link.routerLink).toEqual(['/hashlists/hashlist/', 5, 'edit']);
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

  describe('Edge Cases', () => {
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

    it('should keep the previous filterParam when a later emission has no filter', () => {
      createComponent({ id: '12?cracked' }, { kind: HashesRouteKind.TaskHashes });
      fixture.detectChanges();

      params$.next({ id: '13' });

      expect(component.editedIndex).toBe(13);
      expect(component.filterParam).toBe('cracked');
    });

    it('should accept the minimal valid id 1', () => {
      createComponent({ id: '1' }, { kind: HashesRouteKind.ChunkHashes });
      globalServiceSpy.get.mockReturnValue(of(mockChunkResponse(1)));

      fixture.detectChanges();

      expect(component.editedIndex).toBe(1);
      expect(component.titleName).toBe('1');
    });

    it('should accept the maximum safe integer as id', () => {
      createComponent({ id: String(Number.MAX_SAFE_INTEGER) }, { kind: HashesRouteKind.ChunkHashes });

      fixture.detectChanges();

      expect(component.editedIndex).toBe(Number.MAX_SAFE_INTEGER);
      expect(globalServiceSpy.get).toHaveBeenCalledWith(SERV.CHUNKS, Number.MAX_SAFE_INTEGER);
    });

    it('should fall back to an empty title when the task has no taskName', () => {
      vi.spyOn(console, 'error').mockImplementation(() => undefined);
      vi.spyOn(console, 'log').mockImplementation(() => undefined);
      const { taskName: _omit, ...withoutName } = taskAttributes;
      const invalidTaskResponse = mockResponse({ data: { id: 3, type: 'task', attributes: withoutName } });
      globalServiceSpy.get.mockReturnValue(of(invalidTaskResponse));
      createComponent({ id: '3' }, { kind: HashesRouteKind.TaskHashes });

      fixture.detectChanges();

      expect(component.titleName).toBe('');
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

  describe('getRouterLink', () => {
    beforeEach(() => {
      createComponent({ id: '1' }, { kind: HashesRouteKind.HashlistHashes });
      component.editedIndex = 42;
    });

    it.each([
      [HashesViewType.CHUNKS, ['/tasks/show-tasks/', 42, 'edit']],
      [HashesViewType.TASKS, ['/tasks/show-tasks/', 42, 'edit']],
      [HashesViewType.HASHLISTS, ['/hashlists/hashlist/', 42, 'edit']]
    ])('should return the correct link for view "%s"', (view, expected) => {
      component.whichView = view;

      const result = component.getRouterLink();

      expect(result).toEqual(expected);
    });

    it('should return an empty array when no view is set', () => {
      component.whichView = undefined as unknown as HashesViewType;

      const result = component.getRouterLink();

      expect(result).toEqual([]);
    });

    it('should return an empty array for an unknown view type', () => {
      component.whichView = 'unknown' as HashesViewType;

      const result = component.getRouterLink();

      expect(result).toEqual([]);
    });
  });

  describe('loadHashes – error cases', () => {
    it.each([
      ['non-numeric', 'abc'],
      ['zero', '0'],
      ['negative', '-1'],
      ['decimal', '1.5'],
      ['empty', ''],
      ['only a filter', '?cracked']
    ])('should reject a %s id', async (_label, id) => {
      createComponent({ id }, { kind: HashesRouteKind.HashlistHashes });
      globalServiceSpy.get.mockReturnValue(new Subject<ResponseWrapper>().asObservable());

      fixture.detectChanges();
      await flushUnhandledErrors();

      expect(unhandledErrors.length).toBeGreaterThan(0);
      expect((unhandledErrors[0] as Error).name).toBe('ZodError');
      expect(component.editedIndex).toBeUndefined();
    });

    it('should reject route params without an id', async () => {
      createComponent({}, { kind: HashesRouteKind.HashlistHashes });
      globalServiceSpy.get.mockReturnValue(new Subject<ResponseWrapper>().asObservable());

      fixture.detectChanges();
      await flushUnhandledErrors();

      expect((unhandledErrors[0] as Error).name).toBe('ZodError');
      expect(component.editedIndex).toBeUndefined();
    });

    it('should reject a non-string id', async () => {
      createComponent({ id: 5 }, { kind: HashesRouteKind.HashlistHashes });
      globalServiceSpy.get.mockReturnValue(new Subject<ResponseWrapper>().asObservable());

      fixture.detectChanges();
      await flushUnhandledErrors();

      expect((unhandledErrors[0] as Error).name).toBe('ZodError');
    });

    it.each([
      ['unknown kind', { kind: 'unknown' }],
      ['missing kind', {}],
      ['null kind', { kind: null }]
    ])('should reject route data with %s and not call the API', async (_label, data) => {
      createComponent({ id: '5' }, data);

      fixture.detectChanges();
      await flushUnhandledErrors();

      expect((unhandledErrors[0] as Error).name).toBe('ZodError');
      expect(component.whichView).toBeUndefined();
      expect(globalServiceSpy.get).not.toHaveBeenCalled();
      expect(fixture.nativeElement.querySelector('h2')).toBeNull();
    });

    it.each([
      [HashesRouteKind.ChunkHashes, HashesViewType.CHUNKS],
      [HashesRouteKind.TaskHashes, HashesViewType.TASKS],
      [HashesRouteKind.HashlistHashes, HashesViewType.HASHLISTS]
    ])('should leave the title empty when the API fails for "%s"', async (kind, view) => {
      const apiError = new Error('Server error');
      globalServiceSpy.get.mockReturnValue(throwError(() => apiError));
      createComponent({ id: '5' }, { kind });

      fixture.detectChanges();
      await flushUnhandledErrors();

      expect(component.whichView).toBe(view);
      expect(component.titleName).toBeUndefined();
      expect(unhandledErrors).toContain(apiError);
    });

    it('should report a schema validation error for an invalid API response', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
      vi.spyOn(console, 'log').mockImplementation(() => undefined);
      globalServiceSpy.get.mockReturnValue(of(mockResponse({ data: { id: 5, type: 'hashlist', attributes: {} } })));
      createComponent({ id: '5' }, { kind: HashesRouteKind.HashlistHashes });

      fixture.detectChanges();

      expect(consoleErrorSpy).toHaveBeenCalledWith('API response validation failed', expect.anything());
      expect(component.titleName).toBeUndefined();
    });
  });
});
