import { of } from 'rxjs';
import type { MockedObject } from 'vitest';

import { HttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { PreconfiguredTasksRoleService } from '@services/roles/tasks/preconfiguredTasks-role.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';
import { ConfigService } from '@services/shared/config.service';

import { EditPreconfiguredTasksComponent } from '@src/app/tasks/edit-preconfigured-tasks/edit-preconfigured-tasks.component';
import { mockResponse } from '@src/app/testing/mock-response';

describe('EditPreconfiguredTasksComponent', () => {
  let fixture: ComponentFixture<EditPreconfiguredTasksComponent>;
  let component: EditPreconfiguredTasksComponent;
  let http: MockedObject<HttpClient>;
  let gs: MockedObject<GlobalService>;
  let router: MockedObject<Router>;
  let alert: MockedObject<AlertService>;

  beforeEach(async () => {
    http = { get: vi.fn() } as unknown as MockedObject<HttpClient>;
    gs = { getAll: vi.fn(), update: vi.fn() } as unknown as MockedObject<GlobalService>;
    gs.getAll.mockReturnValue(of(mockResponse()));
    router = {
      navigate: vi.fn().mockResolvedValue(true),
      navigateByUrl: vi.fn().mockResolvedValue(true)
    } as unknown as MockedObject<Router>;
    alert = { showSuccessMessage: vi.fn(), showErrorMessage: vi.fn() } as unknown as MockedObject<AlertService>;
    http.get.mockReturnValue(
      of(
        mockResponse({
          data: {
            id: 3,
            type: 'pretask',
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
              useNewBench: true
            }
          }
        }) as never
      ) as never
    );

    await TestBed.configureTestingModule({
      declarations: [EditPreconfiguredTasksComponent],
      providers: [
        { provide: HttpClient, useValue: http },
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
    fixture = TestBed.createComponent(EditPreconfiguredTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('loads the pretask data into its form', () => {
    expect(component.isLoading).toBe(false);
    expect(component.pretaskName).toBe('Baseline');
    expect(component.updateForm.getRawValue()).toEqual(
      expect.objectContaining({
        pretaskId: 3,
        updateData: expect.objectContaining({ taskName: 'Baseline', priority: 2 })
      })
    );
    expect(gs.getAll).toHaveBeenCalledWith(SERV.PRETASKS, expect.anything());
  });

  it('updates a valid pretask and navigates on success', () => {
    gs.update.mockReturnValue(of({}));
    component.updateForm.get('updateData.taskName')?.setValue('Updated');
    component.onSubmit();
    expect(gs.update).toHaveBeenCalledWith(SERV.PRETASKS, 3, expect.objectContaining({ taskName: 'Updated' }));
    expect(alert.showSuccessMessage).toHaveBeenCalledWith('Preconfigured Task saved');
    expect(router.navigate).toHaveBeenCalledWith(['tasks/preconfigured-tasks']);
  });

  it('does not submit invalid form values and marks controls touched', () => {
    component.updateForm.get('updateData.taskName')?.setValue('');
    const touched = vi.spyOn(component.updateForm, 'markAllAsTouched');
    component.onSubmit();
    expect(touched).toHaveBeenCalled();
    expect(gs.update).not.toHaveBeenCalled();
  });

  it('loads pretask file relationships using the configured endpoint', () => {
    expect(http.get).toHaveBeenCalledWith('http://localhost/api/v2' + SERV.PRETASKS.URL + '/3');
  });
});
