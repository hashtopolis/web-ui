import { zCrackerBinaryListResponse, zCrackerBinaryTypeListResponse } from '@generated/api/zod';
import { of } from 'rxjs';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CrackerBinaryId, CrackerBinaryTypeId } from '@models/id.types';
import { JSuperTask } from '@models/supertask.model';

import {
  CrackerHashtypeSupportService,
  buildUnsupportedHashtypeMessage
} from '@services/crackers/cracker-hashtype-support.service';
import { ServiceConfig } from '@services/main.config';
import { SERV } from '@services/main.config';
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

const TYPES = mockValidResponse(zCrackerBinaryTypeListResponse, {
  data: [
    {
      id: 1,
      type: 'crackerBinaryType',
      attributes: { typeName: 'hashcat', isChunkingAvailable: true },
      relationships: {
        crackerVersions: {
          data: [
            { type: 'crackerBinary', id: 10 },
            { type: 'crackerBinary', id: 11 }
          ]
        }
      }
    },
    {
      id: 2,
      type: 'crackerBinaryType',
      attributes: { typeName: 'generic', isChunkingAvailable: true },
      relationships: { crackerVersions: { data: [{ type: 'crackerBinary', id: 20 }] } }
    }
  ],
  included: [crackerVersion(10, 1), crackerVersion(11, 1), crackerVersion(20, 2)]
});

const HASHCAT_VERSIONS = mockValidResponse(zCrackerBinaryListResponse, {
  data: [crackerVersion(10, 1), crackerVersion(11, 1)]
});

describe('HashlistSupertaskBuilderTableComponent', () => {
  let component: TestHashlistSupertaskBuilderTableComponent;
  let fixture: ComponentFixture<TestHashlistSupertaskBuilderTableComponent>;
  let mockGlobalService: jasmine.SpyObj<GlobalService>;
  let mockAlertService: jasmine.SpyObj<AlertService>;
  let support: jasmine.SpyObj<CrackerHashtypeSupportService>;

  beforeEach(async () => {
    mockGlobalService = jasmine.createSpyObj('GlobalService', ['chelper', 'getAll']);
    mockGlobalService.chelper.and.returnValue(of({}) as unknown as ReturnType<typeof mockGlobalService.chelper>);
    mockGlobalService.getAll.and.returnValue(of({}) as unknown as ReturnType<typeof mockGlobalService.getAll>);

    mockAlertService = jasmine.createSpyObj('AlertService', ['showSuccessMessage', 'showErrorMessage']);

    support = jasmine.createSpyObj('CrackerHashtypeSupportService', ['getSupportedCrackerBinaryIds']);
    support.getSupportedCrackerBinaryIds.and.returnValue(of(new Set([11])));

    await TestBed.configureTestingModule({
      declarations: [TestHashlistSupertaskBuilderTableComponent],
      providers: [
        { provide: GlobalService, useValue: mockGlobalService },
        { provide: AlertService, useValue: mockAlertService },
        { provide: CrackerHashtypeSupportService, useValue: support }
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
    component.supertasks = [
      { id: 10, supertaskName: 'BF set', type: 'supertask' } as JSuperTask,
      { id: 11, supertaskName: 'WL set', type: 'supertask' } as JSuperTask
    ];

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('BF set');
    expect(text).toContain('WL set');
  });

  it('should link the name to the supertask', async () => {
    component.supertasks = [{ id: 10, supertaskName: 'BF set', type: 'supertask' } as JSuperTask];

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

  it('should update versions and default selected version when binary type changes', async () => {
    const versions = [
      { id: 1 as CrackerBinaryId, name: '6.2.6' },
      { id: 2 as CrackerBinaryId, name: '6.2.7' }
    ] as SelectOption<CrackerBinaryId>[];

    const privateComponent = component as unknown as {
      [key: string]: unknown;
    };
    privateComponent['getVersionsForType'] = async (): Promise<SelectOption<CrackerBinaryId>[]> => versions;

    await component.onTypeChanged(22, 5 as CrackerBinaryTypeId);
    await fixture.whenStable();

    expect(component.selectedTypeByRow[22]).toBe(5 as CrackerBinaryTypeId);
    expect(component.rowVersions[22]).toEqual(versions);
    expect(component.selectedVersionByRow[22]).toBe(2 as CrackerBinaryId);
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
    type Internals = { loadCrackerTypes(): Promise<void>; getVersionsForType(id: number): Promise<unknown[]> };

    beforeEach(() => {
      mockGlobalService.getAll.and.callFake(
        (config: ServiceConfig) =>
          of(config.URL === SERV.CRACKERS_TYPES.URL ? TYPES : HASHCAT_VERSIONS) as unknown as ReturnType<
            typeof mockGlobalService.getAll
          >
      );
    });

    function internals(): Internals {
      return component as unknown as Internals;
    }

    it('offers only cracker types and versions supporting the hashtype', async () => {
      component.hashTypeId = 1000;

      await internals().loadCrackerTypes();
      const versions = (await internals().getVersionsForType(1)) as SelectOption<CrackerBinaryId>[];

      expect(support.getSupportedCrackerBinaryIds).toHaveBeenCalledWith(1000);
      expect(component.crackerTypes.map((type) => type.id)).toEqual([1]);
      expect(versions.map((option) => option.id)).toEqual([11]);
      expect(component.unsupportedHashtypeMessage).toBeNull();
    });

    it('shows the block message when no version supports the hashtype', async () => {
      support.getSupportedCrackerBinaryIds.and.returnValue(of(new Set<number>()));
      component.hashTypeId = 1000;
      component.hashtypeDescription = 'NTLM';

      await internals().loadCrackerTypes();
      fixture.detectChanges();

      expect(component.crackerTypes).toEqual([]);
      expect(component.unsupportedHashtypeMessage).toBe(buildUnsupportedHashtypeMessage(1000, 'NTLM'));
      expect(fixture.nativeElement.querySelector('[data-testid="unsupported-hashtype"]')).toBeTruthy();
    });

    it('does not filter without a hashtype', async () => {
      await internals().loadCrackerTypes();

      expect(support.getSupportedCrackerBinaryIds).not.toHaveBeenCalled();
      expect(component.crackerTypes.map((type) => type.id)).toEqual([1, 2]);
    });
  });
});
