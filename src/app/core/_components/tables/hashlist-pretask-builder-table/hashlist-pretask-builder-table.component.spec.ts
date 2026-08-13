import { of } from 'rxjs';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { JPretask } from '@models/pretask.model';

import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';

import { HashlistPretaskBuilderTableComponent } from '@components/tables/hashlist-pretask-builder-table/hashlist-pretask-builder-table.component';

class TestHashlistPretaskBuilderTableComponent extends HashlistPretaskBuilderTableComponent {
  override ngOnInit(): void {}
  override ngOnDestroy(): void {}
}

describe('HashlistPretaskBuilderTableComponent', () => {
  let component: TestHashlistPretaskBuilderTableComponent;
  let fixture: ComponentFixture<TestHashlistPretaskBuilderTableComponent>;
  let mockGlobalService: jasmine.SpyObj<GlobalService>;
  let mockAlertService: jasmine.SpyObj<AlertService>;

  beforeEach(async () => {
    mockGlobalService = jasmine.createSpyObj('GlobalService', ['create', 'getAll']);
    mockGlobalService.create.and.returnValue(of({}) as unknown as ReturnType<typeof mockGlobalService.create>);
    mockGlobalService.getAll.and.returnValue(of({}) as unknown as ReturnType<typeof mockGlobalService.getAll>);

    mockAlertService = jasmine.createSpyObj('AlertService', ['showSuccessMessage', 'showErrorMessage']);

    await TestBed.configureTestingModule({
      declarations: [TestHashlistPretaskBuilderTableComponent],
      providers: [
        { provide: GlobalService, useValue: mockGlobalService },
        { provide: AlertService, useValue: mockAlertService }
      ],
      imports: [RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHashlistPretaskBuilderTableComponent);
    component = fixture.componentInstance;
    component.hashlistId = '4';
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render ID, Color and Name headers', async () => {
    await fixture.whenStable();
    fixture.detectChanges();

    const headers = Array.from(fixture.nativeElement.querySelectorAll('th') as NodeListOf<Element>).map((th) =>
      th.textContent?.trim()
    );

    expect(headers).toEqual(['ID', 'Color', 'Name']);
  });

  it('should render color preview when pretask has color and keep empty when no color', async () => {
    component.pretasks = [
      { id: '1', taskName: 'Stored without hash', color: 'ff0000', type: 'pretask' } as JPretask,
      { id: '2', taskName: 'Stored with hash', color: '#00ff00', type: 'pretask' } as JPretask,
      { id: '3', taskName: 'No color', color: '', type: 'pretask' } as JPretask,
      { id: '4', taskName: 'Invalid color', color: 'not-a-color', type: 'pretask' } as JPretask
    ];

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const previews = fixture.nativeElement.querySelectorAll('.color-preview') as NodeListOf<HTMLElement>;
    expect(previews.length).toBe(4);
    expect(previews[0].style.backgroundColor).toBe('rgb(255, 0, 0)');
    expect(previews[1].style.backgroundColor).toBe('rgb(0, 255, 0)');
    expect(previews[2].style.backgroundColor).toBe('');
    expect(previews[3].style.backgroundColor).toBe('');
  });

  it('should link the name to the pretask', async () => {
    component.pretasks = [{ id: '7', taskName: 'Linked', type: 'pretask' } as JPretask];

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const nameLink = fixture.nativeElement.querySelector('.name-col a') as HTMLAnchorElement;
    expect(nameLink.textContent?.trim()).toBe('Linked');
    expect(nameLink.getAttribute('href')).toBe('/tasks/preconfigured-tasks/7/edit');
  });

  it('should select and unselect all rows', () => {
    component.pretasks = [
      { id: '1', taskName: 'A', type: 'pretask' } as JPretask,
      { id: '2', taskName: 'B', type: 'pretask' } as JPretask
    ];

    component.toggleSelectAll(true);
    expect(component.selectedPretaskIds.size).toBe(2);

    component.toggleSelectAll(false);
    expect(component.selectedPretaskIds.size).toBe(0);
  });

  it('should keep the selection when rows are re-emitted and drop ids that vanished', () => {
    const rows = [
      { id: '1', taskName: 'A', type: 'pretask' } as JPretask,
      { id: '2', taskName: 'B', type: 'pretask' } as JPretask
    ];
    component.pretasks = rows;
    component.selectedPretaskIds = new Set(['1', '2']);

    const privateComponent = component as unknown as { retainSelection(rows: JPretask[]): void };

    privateComponent.retainSelection(rows);
    expect(Array.from(component.selectedPretaskIds)).toEqual(['1', '2']);

    privateComponent.retainSelection([rows[0]]);
    expect(Array.from(component.selectedPretaskIds)).toEqual(['1']);
  });

  it('should show an error when creating with no selection', async () => {
    await component.createTasksFromSelection();
    await fixture.whenStable();

    expect(mockAlertService.showErrorMessage).toHaveBeenCalledWith('Select at least one pre-configured task.');
  });

  it('should report success and failed count for mixed create results', async () => {
    component.pretasks = [
      { id: '1', taskName: 'A', type: 'pretask' } as JPretask,
      { id: '2', taskName: 'B', type: 'pretask' } as JPretask
    ];
    component.selectedPretaskIds = new Set(['1', '2']);

    const privateComponent = component as unknown as {
      [key: string]: unknown;
    };
    privateComponent['createTaskFromPretask'] = async (pretask: JPretask): Promise<boolean> => pretask.id !== '2';

    await component.createTasksFromSelection();
    await fixture.whenStable();

    expect(mockAlertService.showSuccessMessage).toHaveBeenCalledWith('Created 1 task(s) from pre-configured tasks.');
    expect(mockAlertService.showErrorMessage).toHaveBeenCalledWith('Failed to create 1 task(s).');
  });

  it('should keep the after cursor and clear selection when paging forward', () => {
    const setPaginationConfig = jasmine.createSpy('setPaginationConfig');
    const reload = jasmine.createSpy('reload');
    component.selectedPretaskIds = new Set(['1', '2']);
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

    expect(component.selectedPretaskIds.size).toBe(0);
    expect(setPaginationConfig).toHaveBeenCalledWith(10, 30, 'AFTER', null, 1);
    expect(reload).toHaveBeenCalled();
  });

  it('should reset cursors when jumping to the first page', () => {
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

    component.onPageChange({ pageIndex: 0, pageSize: 10, length: 30, previousPageIndex: 2 });

    expect(setPaginationConfig).toHaveBeenCalledWith(10, 30, null, null, 0);
    expect(reload).toHaveBeenCalled();
  });
});
