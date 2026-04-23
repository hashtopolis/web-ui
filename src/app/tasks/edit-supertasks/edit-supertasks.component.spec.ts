import { of, throwError } from 'rxjs';

import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { JPretask } from '@models/pretask.model';
import { JSuperTask } from '@models/supertask.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { ConfirmDialogService } from '@services/confirm/confirm-dialog.service';
import { GlobalService } from '@services/main.service';
import { SupertaskRole, SupertasksRoleService } from '@services/roles/tasks/supertasks-role.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

import { EditSupertasksComponent } from '@src/app/tasks/edit-supertasks/edit-supertasks.component';
import { mockResponse } from '@src/app/testing/mock-response';

async function flushLoad(fixture: ComponentFixture<EditSupertasksComponent>): Promise<void> {
  fixture.detectChanges();
  await fixture.whenStable();
  await fixture.whenStable();
}

const MOCK_SUPERTASK: JSuperTask = {
  id: 3,
  supertaskName: 'MegaCrack',
  pretasks: [{ id: 11 } as JPretask]
} as JSuperTask;

describe('EditSupertasksComponent', () => {
  let component: EditSupertasksComponent;
  let fixture: ComponentFixture<EditSupertasksComponent>;
  let httpTesting: HttpTestingController;

  let titleServiceSpy: jasmine.SpyObj<AutoTitleService>;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;
  let globalServiceSpy: jasmine.SpyObj<GlobalService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let serializerSpy: jasmine.SpyObj<JsonAPISerializer>;
  let roleServiceSpy: jasmine.SpyObj<SupertasksRoleService>;
  let confirmDialogSpy: jasmine.SpyObj<ConfirmDialogService>;

  beforeEach(async () => {
    titleServiceSpy = jasmine.createSpyObj('AutoTitleService', ['set']);
    alertServiceSpy = jasmine.createSpyObj('AlertService', ['showErrorMessage', 'showSuccessMessage']);
    globalServiceSpy = jasmine.createSpyObj('GlobalService', ['get', 'getAll', 'delete', 'postRelationships']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl']);
    serializerSpy = jasmine.createSpyObj('JsonAPISerializer', ['deserialize']);
    roleServiceSpy = jasmine.createSpyObj('SupertasksRoleService', ['hasRole']);
    confirmDialogSpy = jasmine.createSpyObj('ConfirmDialogService', ['confirmDeletion']);

    roleServiceSpy.hasRole.and.returnValue(false);
    serializerSpy.deserialize.and.returnValue(MOCK_SUPERTASK);
    globalServiceSpy.get.and.returnValue(of(mockResponse()));
    globalServiceSpy.getAll.and.returnValue(of(mockResponse()));
    globalServiceSpy.delete.and.returnValue(of(mockResponse()));
    globalServiceSpy.postRelationships.and.returnValue(of(mockResponse()));
    routerSpy.navigate.and.returnValue(Promise.resolve(true));
    routerSpy.navigateByUrl.and.returnValue(Promise.resolve(true));

    await TestBed.configureTestingModule({
      declarations: [EditSupertasksComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AutoTitleService, useValue: titleServiceSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: '3' } } } },
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: GlobalService, useValue: globalServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: JsonAPISerializer, useValue: serializerSpy },
        { provide: ConfirmDialogService, useValue: confirmDialogSpy },
        { provide: SupertasksRoleService, useValue: roleServiceSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(EditSupertasksComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpTesting.verify();
  });

  describe('Component creation', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should set the page title', () => {
      expect(titleServiceSpy.set).toHaveBeenCalledWith(['Edit SuperTasks']);
    });
  });

  describe('loadData', () => {
    it('should populate the view form from the loaded supertask', async () => {
      await flushLoad(fixture);

      expect(component.viewForm.controls.supertaskId.value).toBe(3);
      expect(component.viewForm.controls.supertaskName.value).toBe('MegaCrack');
      expect(component.editName).toBe('MegaCrack');
    });

    it('should drop the loading gate when the user lacks the editSupertaskPreTasks role', async () => {
      await flushLoad(fixture);

      expect(component.isLoading).toBe(false);
    });

    it('should fetch available pretasks when the user has the editSupertaskPreTasks role', async () => {
      roleServiceSpy.hasRole.and.callFake((role: string) => role === SupertaskRole.EditSupertaskPreTasks);
      serializerSpy.deserialize.and.returnValues(MOCK_SUPERTASK, [{ id: 22 } as JPretask, { id: 11 } as JPretask]);

      await flushLoad(fixture);
      await fixture.whenStable();

      expect(globalServiceSpy.getAll).toHaveBeenCalled();
      expect(component.selectPretasks).toBeTruthy();
    });

    it('should redirect to /forbidden on 403', async () => {
      globalServiceSpy.get.and.returnValue(throwError(() => new HttpErrorResponse({ status: 403 })));

      await flushLoad(fixture);

      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/forbidden');
    });

    it('should redirect to /not-found on 404', async () => {
      globalServiceSpy.get.and.returnValue(throwError(() => new HttpErrorResponse({ status: 404 })));

      await flushLoad(fixture);

      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/not-found');
    });

    it('should retry without includes on 500 and apply the fallback response', async () => {
      globalServiceSpy.get.and.returnValues(
        throwError(() => new HttpErrorResponse({ status: 500 })),
        of(mockResponse())
      );

      await flushLoad(fixture);
      await fixture.whenStable();
      await fixture.whenStable();

      expect(globalServiceSpy.get).toHaveBeenCalledTimes(2);
      expect(component.viewForm.controls.supertaskName.value).toBe('MegaCrack');
    });
  });

  describe('getAvailablePretasks', () => {
    it('should return only pretasks that are not already assigned', () => {
      const assigned: JPretask[] = [{ id: 1 } as JPretask, { id: 2 } as JPretask];
      const all: JPretask[] = [{ id: 1 } as JPretask, { id: 2 } as JPretask, { id: 3 } as JPretask];

      const result = component.getAvailablePretasks(assigned, all);

      expect(result.map((p) => p.id)).toEqual([3]);
    });
  });

  describe('onPretaskAdd', () => {
    it('should early-return when the list is empty', async () => {
      await flushLoad(fixture);
      globalServiceSpy.postRelationships.calls.reset();

      await component.onPretaskAdd([]);

      expect(globalServiceSpy.postRelationships).not.toHaveBeenCalled();
    });

    it('should post relationships and show a success alert', async () => {
      await flushLoad(fixture);

      await component.onPretaskAdd([{ id: 5 } as JPretask, { id: 6 } as JPretask]);

      expect(globalServiceSpy.postRelationships).toHaveBeenCalled();
      expect(alertServiceSpy.showSuccessMessage).toHaveBeenCalledWith('2 pretask(s) added to Supertask');
    });

    it('should show an error alert when the request fails', async () => {
      globalServiceSpy.postRelationships.and.returnValue(throwError(() => new HttpErrorResponse({ status: 500 })));
      await flushLoad(fixture);

      await component.onPretaskAdd([{ id: 5 } as JPretask]);

      expect(alertServiceSpy.showErrorMessage).toHaveBeenCalledWith('Failed to add pretask(s).');
    });
  });

  describe('onDelete', () => {
    it('should delete and navigate to the supertask list when confirmed', async () => {
      confirmDialogSpy.confirmDeletion.and.returnValue(of(true));
      await flushLoad(fixture);

      await component.onDelete();

      expect(globalServiceSpy.delete).toHaveBeenCalled();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/tasks/supertasks']);
    });

    it('should not delete when the user cancels the dialog', async () => {
      confirmDialogSpy.confirmDeletion.and.returnValue(of(false));
      await flushLoad(fixture);

      await component.onDelete();

      expect(globalServiceSpy.delete).not.toHaveBeenCalled();
    });
  });
});
