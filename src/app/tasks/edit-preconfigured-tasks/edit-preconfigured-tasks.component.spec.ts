import { zPreTaskResponse } from '@generated/api/zod';
import { of } from 'rxjs';
import type { MockedObject } from 'vitest';

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { FilterType } from '@models/request-params.model';

import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { PreconfiguredTasksRoleService } from '@services/roles/tasks/preconfiguredTasks-role.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';
import { ConfigService } from '@services/shared/config.service';

import { EditPreconfiguredTasksComponent } from '@src/app/tasks/edit-preconfigured-tasks/edit-preconfigured-tasks.component';
import { mockResponse, mockValidResponse } from '@src/app/testing/mock-response';

describe('EditPreconfiguredTasksComponent', () => {
  let fixture: ComponentFixture<EditPreconfiguredTasksComponent>;
  let component: EditPreconfiguredTasksComponent;
  let httpMock: HttpTestingController;
  let gs: MockedObject<GlobalService>;
  let router: MockedObject<Router>;
  let alert: MockedObject<AlertService>;

  beforeEach(async () => {
    gs = {
      getAll: vi.fn().mockName('GlobalService.getAll'),
      update: vi.fn().mockName('GlobalService.update')
    } as MockedObject<GlobalService>;
    gs.getAll.mockReturnValue(of(mockResponse()));
    router = {
      navigate: vi.fn().mockName('Router.navigate').mockResolvedValue(true),
      navigateByUrl: vi.fn().mockName('Router.navigateByUrl').mockResolvedValue(true)
    } as MockedObject<Router>;
    alert = {
      showSuccessMessage: vi.fn().mockName('AlertService.showSuccessMessage'),
      showErrorMessage: vi.fn().mockName('AlertService.showErrorMessage')
    } as MockedObject<AlertService>;
    await TestBed.configureTestingModule({
      declarations: [EditPreconfiguredTasksComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: GlobalService, useValue: gs },
        { provide: Router, useValue: router },
        { provide: AlertService, useValue: alert },
        { provide: AutoTitleService, useValue: { set: vi.fn() } },
        { provide: ConfigService, useValue: { getEndpoint: () => 'http://localhost/api/v2' } },
        { provide: PreconfiguredTasksRoleService, useValue: { hasRole: () => true } },
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: '3' } } } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(EditPreconfiguredTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpMock.expectOne('http://localhost/api/v2' + SERV.PRETASKS.URL + '/3').flush(
      mockValidResponse(zPreTaskResponse, {
        data: {
          id: 3,
          type: 'preTask',
          attributes: {
            taskName: 'Baseline',
            attackCmd: '-a 0 #HL# words.txt',
            chunkTime: 600,
            color: '#112233',
            priority: 2,
            maxAgents: 4,
            isCpuTask: false,
            isSmall: true,
            statusTimer: 5,
            useNewBench: true,
            isMaskImport: false,
            crackerBinaryTypeId: 1
          }
        }
      })
    );
    await fixture.whenStable();
  });

  afterEach(() => httpMock.verify());

  it('loads the pretask data into its form', () => {
    expect(component.isLoading).toBe(false);
    expect(component.pretaskName).toBe('Baseline');
    expect(component.updateForm.getRawValue()).toStrictEqual(
      expect.objectContaining({
        pretaskId: 3,
        updateData: expect.objectContaining({ taskName: 'Baseline', priority: 2 })
      })
    );
    expect(alert.showErrorMessage).not.toHaveBeenCalled();
    expect(gs.getAll).toHaveBeenCalledExactlyOnceWith(SERV.PRETASKS, {
      filter: [{ field: 'pretaskId', operator: FilterType.EQUAL, value: 3 }],
      include: ['pretaskFiles']
    });
  });

  it('updates a valid pretask and navigates on success', () => {
    gs.update.mockReturnValue(of(mockResponse()));
    component.updateForm.get('updateData.taskName')?.setValue('Updated');
    component.onSubmit();
    expect(gs.update).toHaveBeenCalledExactlyOnceWith(
      SERV.PRETASKS,
      3,
      expect.objectContaining({ taskName: 'Updated' })
    );
    expect(alert.showSuccessMessage).toHaveBeenCalledExactlyOnceWith('Preconfigured Task saved');
    expect(router.navigate).toHaveBeenCalledExactlyOnceWith(['tasks/preconfigured-tasks']);
  });

  it('does not submit invalid form values and marks controls touched', () => {
    component.updateForm.get('updateData.taskName')?.setValue('');
    component.onSubmit();
    expect(component.updateForm.get('updateData.taskName')?.touched).toBe(true);
    expect(component.updateForm.get('updateData.attackCmd')?.touched).toBe(true);
    expect(gs.update).not.toHaveBeenCalled();
  });

  it('loads pretask file relationships using the configured endpoint', () => {
    expect(gs.getAll).toHaveBeenCalledExactlyOnceWith(SERV.PRETASKS, {
      include: ['pretaskFiles'],
      filter: [{ field: 'pretaskId', operator: FilterType.EQUAL, value: 3 }]
    });
  });
});
