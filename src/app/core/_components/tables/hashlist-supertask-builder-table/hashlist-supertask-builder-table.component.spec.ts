import { of } from 'rxjs';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CrackerBinaryId, CrackerBinaryTypeId } from '@models/id.types';
import { JSuperTask } from '@models/supertask.model';

import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';

import { HashlistSupertaskBuilderTableComponent } from '@components/tables/hashlist-supertask-builder-table/hashlist-supertask-builder-table.component';

import { SelectOption } from '@src/app/shared/utils/forms';

class TestHashlistSupertaskBuilderTableComponent extends HashlistSupertaskBuilderTableComponent {
  override ngOnInit(): void {}
  override ngOnDestroy(): void {}
}

describe('HashlistSupertaskBuilderTableComponent', () => {
  let component: TestHashlistSupertaskBuilderTableComponent;
  let fixture: ComponentFixture<TestHashlistSupertaskBuilderTableComponent>;
  let mockGlobalService: jasmine.SpyObj<GlobalService>;
  let mockAlertService: jasmine.SpyObj<AlertService>;

  beforeEach(async () => {
    mockGlobalService = jasmine.createSpyObj('GlobalService', ['chelper', 'getAll']);
    mockGlobalService.chelper.and.returnValue(of({}) as unknown as ReturnType<typeof mockGlobalService.chelper>);
    mockGlobalService.getAll.and.returnValue(of({}) as unknown as ReturnType<typeof mockGlobalService.getAll>);

    mockAlertService = jasmine.createSpyObj('AlertService', ['showSuccessMessage', 'showErrorMessage']);

    await TestBed.configureTestingModule({
      declarations: [TestHashlistSupertaskBuilderTableComponent],
      providers: [
        { provide: GlobalService, useValue: mockGlobalService },
        { provide: AlertService, useValue: mockAlertService }
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
});
