import { of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseModel } from '@models/base.model';
import { JCrackerBinaryType } from '@models/cracker-binary.model';

import { CrackerBinaryTypesService } from '@services/crackers/cracker-binary-types.service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';

import { CrackersTableComponent } from '@components/tables/crackers-table/crackers-table.component';
import { CrackersTableColumnLabel } from '@components/tables/crackers-table/crackers-table.constants';
import { HTTableComponent } from '@components/tables/ht-table/ht-table.component';

import { CrackersDataSource } from '@datasources/crackers.datasource';

class MockCrackersDataSource {
  loadAll() {}
  setColumns() {}
  clearFilter() {}
  reload() {}
}

class TestCrackersTableComponent extends CrackersTableComponent {
  override ngOnInit(): void {
    this.setColumnLabels(CrackersTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new MockCrackersDataSource() as unknown as CrackersDataSource;
  }
}

type DeleteMethods = {
  rowActionDelete(crackers: JCrackerBinaryType[]): void;
  bulkActionDelete(crackers: JCrackerBinaryType[]): void;
};

describe('CrackersTableComponent', () => {
  let component: TestCrackersTableComponent;
  let fixture: ComponentFixture<TestCrackersTableComponent>;
  let gs: jasmine.SpyObj<GlobalService>;
  let crackerBinaryTypes: jasmine.SpyObj<CrackerBinaryTypesService>;

  const crackerType = {
    id: 3,
    type: 'crackerBinaryType',
    typeName: 'generic',
    crackerVersions: []
  } as JCrackerBinaryType;

  beforeEach(async () => {
    gs = jasmine.createSpyObj('GlobalService', ['delete', 'bulkDelete']);
    gs.delete.and.returnValue(of({}));
    gs.bulkDelete.and.returnValue(of({}));
    crackerBinaryTypes = jasmine.createSpyObj('CrackerBinaryTypesService', ['invalidate']);

    await TestBed.configureTestingModule({
      declarations: [TestCrackersTableComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: GlobalService, useValue: gs },
        { provide: CrackerBinaryTypesService, useValue: crackerBinaryTypes },
        {
          provide: AlertService,
          useValue: jasmine.createSpyObj('AlertService', ['showSuccessMessage', 'showErrorMessage'])
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TestCrackersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.table = jasmine.createSpyObj('HTTableComponent', ['reload']) as unknown as HTTableComponent<BaseModel>;
  });

  it('invalidates the cracker types after deleting one', () => {
    (component as unknown as DeleteMethods).rowActionDelete([crackerType]);
    expect(gs.delete).toHaveBeenCalledWith(SERV.CRACKERS_TYPES, 3);
    expect(crackerBinaryTypes.invalidate).toHaveBeenCalled();
  });

  it('invalidates the cracker types after a bulk delete', () => {
    (component as unknown as DeleteMethods).bulkActionDelete([crackerType]);
    expect(gs.bulkDelete).toHaveBeenCalledWith(SERV.CRACKERS_TYPES, [crackerType]);
    expect(crackerBinaryTypes.invalidate).toHaveBeenCalled();
  });
});
