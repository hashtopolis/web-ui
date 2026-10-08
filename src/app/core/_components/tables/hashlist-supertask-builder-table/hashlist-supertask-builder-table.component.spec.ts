import { zCrackerBinaryListResponse } from '@generated/api/zod';
import { Observable, of } from 'rxjs';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CrackerBinaryId, CrackerBinaryTypeId } from '@models/id.types';
import { RequestParams } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';
import { JSuperTask } from '@models/supertask.model';

import { CrackerBinaryTypesService } from '@services/crackers/cracker-binary-types.service';
import {
  CrackerHashtypeSupportService,
  SUPPORT_LOOKUP_FAILED,
  buildUnsupportedHashtypeMessage
} from '@services/crackers/cracker-hashtype-support.service';
import { SERV, ServiceConfig } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';

import { HashlistSupertaskBuilderTableComponent } from '@components/tables/hashlist-supertask-builder-table/hashlist-supertask-builder-table.component';

import { SelectOption } from '@src/app/shared/utils/forms';
import { mockValidResponse } from '@src/app/testing/mock-response';

class TestHashlistSupertaskBuilderTableComponent extends HashlistSupertaskBuilderTableComponent {
  override ngOnInit(): void {}
  override ngOnDestroy(): void {}
}

function crackerVersion(id: number, crackerBinaryTypeId: number) {
  return {
    id,
    type: 'crackerBinary' as const,
    attributes: {
      crackerBinaryTypeId,
      binaryName: 'hashcat',
      version: `${id}`,
      downloadUrl: '',
      filename: null,
      accessGroupId: 1
    }
  };
}

const HASHCAT_VERSIONS = mockValidResponse(zCrackerBinaryListResponse, {
  data: [crackerVersion(10, 1), crackerVersion(11, 1)]
});

const GENERIC_VERSIONS = mockValidResponse(zCrackerBinaryListResponse, { data: [crackerVersion(20, 2)] });

function supertask(id: number, supertaskName: string, crackerBinaryTypeId: number): JSuperTask {
  return { id, supertaskName, type: 'supertask', crackerBinaryTypeId };
}

/** Versions by the cracker type requested through the filter */
function versionsByType(config: ServiceConfig, params?: RequestParams): Observable<ResponseWrapper> {
  const typeId = config.URL === SERV.CRACKERS.URL ? params?.filter?.[0]?.value : undefined;
  return of(typeId === 2 ? GENERIC_VERSIONS : HASHCAT_VERSIONS);
}

describe('HashlistSupertaskBuilderTableComponent', () => {
  let component: TestHashlistSupertaskBuilderTableComponent;
  let fixture: ComponentFixture<TestHashlistSupertaskBuilderTableComponent>;
  let mockGlobalService: jasmine.SpyObj<GlobalService>;
  let mockAlertService: jasmine.SpyObj<AlertService>;
  let support: jasmine.SpyObj<CrackerHashtypeSupportService>;
  let crackerBinaryTypes: jasmine.SpyObj<CrackerBinaryTypesService>;

  type Internals = {
    loadSupport(): Promise<void>;
    initializeRows(): Promise<void>;
    getVersionsForType(id: number): Promise<SelectOption<CrackerBinaryId>[]>;
  };

  function internals(): Internals {
    return component as unknown as Internals;
  }

  beforeEach(async () => {
    mockGlobalService = jasmine.createSpyObj('GlobalService', ['chelper', 'getAll']);
    mockGlobalService.chelper.and.returnValue(of({}) as unknown as ReturnType<typeof mockGlobalService.chelper>);
    mockGlobalService.getAll.and.returnValue(of({}) as unknown as ReturnType<typeof mockGlobalService.getAll>);

    mockAlertService = jasmine.createSpyObj('AlertService', ['showSuccessMessage', 'showErrorMessage']);

    support = jasmine.createSpyObj('CrackerHashtypeSupportService', ['getSupportedCrackerBinaryIds']);
    support.getSupportedCrackerBinaryIds.and.returnValue(of(new Set([11])));

    crackerBinaryTypes = jasmine.createSpyObj('CrackerBinaryTypesService', ['getTypeNames']);
    crackerBinaryTypes.getTypeNames.and.returnValue(
      of(
        new Map<CrackerBinaryTypeId, string>([
          [1, 'hashcat'],
          [2, 'generic']
        ])
      )
    );

    await TestBed.configureTestingModule({
      declarations: [TestHashlistSupertaskBuilderTableComponent],
      providers: [
        { provide: GlobalService, useValue: mockGlobalService },
        { provide: AlertService, useValue: mockAlertService },
        { provide: CrackerHashtypeSupportService, useValue: support },
        { provide: CrackerBinaryTypesService, useValue: crackerBinaryTypes }
      ],
      imports: [RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHashlistSupertaskBuilderTableComponent);
    component = fixture.componentInstance;
    component.hashlistId = 4;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render supertask rows', async () => {
    component.supertasks = [supertask(10, 'BF set', 1), supertask(11, 'WL set', 2)];

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('BF set');
    expect(text).toContain('WL set');
  });

  it('should link the name to the supertask', async () => {
    component.supertasks = [supertask(10, 'BF set', 1)];

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const links = Array.from(fixture.nativeElement.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>);
    const nameLink = links.find((link) => link.textContent?.trim() === 'BF set');
    expect(nameLink?.getAttribute('href')).toBe('/tasks/10/edit');
  });

  it('should show error and not call backend when no version is selected', async () => {
    await component.createSupertask(10);
    await fixture.whenStable();

    expect(mockAlertService.showErrorMessage).toHaveBeenCalledWith('Select a binary version first.');
    expect(mockGlobalService.chelper).not.toHaveBeenCalled();
  });

  it('should call backend helper and show success when creating supertask', async () => {
    component.selectedVersionByRow[10] = 77 as CrackerBinaryId;

    await component.createSupertask(10);
    await fixture.whenStable();

    expect(mockGlobalService.chelper).toHaveBeenCalledWith(SERV.HELPER, 'createSupertask', {
      supertaskTemplateId: 10,
      hashlistId: 4,
      crackerVersionId: 77
    });
    expect(mockAlertService.showSuccessMessage).toHaveBeenCalledWith('New Supertask created');
    expect(component.rowLoading[10]).toBeFalse();
  });

  it('initializes each row with the versions of its own type', async () => {
    mockGlobalService.getAll.and.callFake(
      versionsByType as unknown as (...args: unknown[]) => ReturnType<typeof mockGlobalService.getAll>
    );
    component.supertasks = [supertask(10, 'BF set', 1), supertask(11, 'WL set', 2)];
    await internals().loadSupport();

    await internals().initializeRows();

    expect(component.rowVersions[10]?.map((option) => option.id)).toEqual([10, 11]);
    expect(component.selectedVersionByRow[10]).toBe(11 as CrackerBinaryId);
    expect(component.rowVersions[11]?.map((option) => option.id)).toEqual([20]);
    expect(component.selectedVersionByRow[11]).toBe(20 as CrackerBinaryId);
    expect(mockGlobalService.getAll.calls.allArgs().every(([config]) => config.URL === SERV.CRACKERS.URL)).toBeTrue();
  });

  it('shows the type name per row and falls back for unknown ids', async () => {
    component.supertasks = [supertask(10, 'BF set', 1), supertask(11, 'WL set', 7)];
    await internals().loadSupport();
    fixture.detectChanges();

    const types = Array.from(fixture.nativeElement.querySelectorAll('[data-testid="row-type"]')).map((el) =>
      (el as HTMLElement).textContent?.trim()
    );
    expect(types).toEqual(['hashcat', 'Type #7']);
  });

  it('should keep the after cursor when paging forward', () => {
    const setPaginationConfig = jasmine.createSpy('setPaginationConfig');
    const reload = jasmine.createSpy('reload');
    (component as unknown as { dataSource: unknown }).dataSource = {
      pageAfter: 'AFTER',
      pageBefore: 'BEFORE',
      index: 0,
      pageSize: 10,
      totalItems: 30,
      setPaginationConfig,
      reload
    };

    component.onPageChange({ pageIndex: 1, pageSize: 10, length: 30, previousPageIndex: 0 });

    expect(setPaginationConfig).toHaveBeenCalledWith(10, 30, 'AFTER', null, 1);
    expect(reload).toHaveBeenCalled();
  });

  it('should reset cursors when the page size changes', () => {
    const setPaginationConfig = jasmine.createSpy('setPaginationConfig');
    const reload = jasmine.createSpy('reload');
    (component as unknown as { dataSource: unknown }).dataSource = {
      pageAfter: 'AFTER',
      pageBefore: 'BEFORE',
      index: 2,
      pageSize: 10,
      totalItems: 30,
      setPaginationConfig,
      reload
    };

    component.onPageChange({ pageIndex: 2, pageSize: 25, length: 30, previousPageIndex: 2 });

    expect(setPaginationConfig).toHaveBeenCalledWith(25, 30, null, null, 0);
    expect(reload).toHaveBeenCalled();
  });

  describe('hashtype support', () => {
    beforeEach(() => {
      mockGlobalService.getAll.and.callFake(
        versionsByType as unknown as (...args: unknown[]) => ReturnType<typeof mockGlobalService.getAll>
      );
    });

    it('offers only the versions supporting the hashtype', async () => {
      component.hashTypeId = 1000;

      await internals().loadSupport();
      const versions = await internals().getVersionsForType(1);

      expect(support.getSupportedCrackerBinaryIds).toHaveBeenCalledWith(1000);
      expect(versions.map((option) => option.id)).toEqual([11]);
      expect(component.unsupportedHashtypeMessage).toBeNull();
    });

    it('blocks a row whose type has no supported version', async () => {
      component.hashTypeId = 1000;
      component.supertasks = [supertask(10, 'BF set', 1), supertask(11, 'WL set', 2)];
      await internals().loadSupport();

      await internals().initializeRows();
      fixture.detectChanges();

      expect(component.isRowBlocked(component.supertasks[0])).toBeFalse();
      expect(component.selectedVersionByRow[10]).toBe(11 as CrackerBinaryId);
      expect(component.isRowBlocked(component.supertasks[1])).toBeTrue();
      expect(component.selectedVersionByRow[11]).toBeUndefined();
      expect(component.rowBlockedMessage(component.supertasks[1])).toBe(
        'No accessible generic version supports this hashtype.'
      );
      expect(fixture.nativeElement.querySelectorAll('[data-testid="row-blocked"]').length).toBe(1);
      expect(component.unsupportedHashtypeMessage).toBeNull();
    });

    it('shows the block message when no version supports the hashtype', async () => {
      support.getSupportedCrackerBinaryIds.and.returnValue(of(new Set<number>()));
      component.hashTypeId = 1000;
      component.hashtypeDescription = 'NTLM';

      await internals().loadSupport();
      fixture.detectChanges();

      expect(component.unsupportedHashtypeMessage).toBe(buildUnsupportedHashtypeMessage(1000, 'NTLM'));
      expect(fixture.nativeElement.querySelector('[data-testid="unsupported-hashtype"]')).toBeTruthy();
    });

    it('says the check failed when the support lookup failed', async () => {
      support.getSupportedCrackerBinaryIds.and.returnValue(of(SUPPORT_LOOKUP_FAILED));
      component.hashTypeId = 1000;
      component.hashtypeDescription = 'NTLM';
      component.supertasks = [supertask(11, 'WL set', 2)];
      await internals().loadSupport();

      await internals().initializeRows();

      expect(component.unsupportedHashtypeMessage).toBe(
        'Could not check which cracker versions support hashtype 1000 (NTLM).'
      );
      expect(component.isRowBlocked(component.supertasks[0])).toBeTrue();
      expect(component.rowBlockedMessage(component.supertasks[0])).toBe(
        'Could not check which generic versions support this hashtype.'
      );
    });

    it('does not filter without a hashtype', async () => {
      await internals().loadSupport();
      const versions = await internals().getVersionsForType(1);

      expect(support.getSupportedCrackerBinaryIds).not.toHaveBeenCalled();
      expect(versions.map((option) => option.id)).toEqual([10, 11]);
      expect(component.rowBlockedMessage(supertask(11, 'WL set', 2))).toBe('No accessible generic version.');
    });
  });
});
