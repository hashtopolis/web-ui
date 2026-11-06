import { NEVER, of } from 'rxjs';
import type { MockedObject } from 'vitest';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { NewPretaskRouteKind } from '@models/routes.schema';

import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';
import { UIConfigService } from '@services/shared/storage.service';

import { NewPreconfiguredTasksComponent } from '@src/app/tasks/new-preconfigured-tasks/new-preconfigured-tasks.component';
import { mockResponse } from '@src/app/testing/mock-response';

describe('NewPreconfiguredTasksComponent', () => {
  let fixture: ComponentFixture<NewPreconfiguredTasksComponent>;
  let component: NewPreconfiguredTasksComponent;
  let gs: MockedObject<GlobalService>;
  let alert: MockedObject<AlertService>;
  let router: MockedObject<Router>;

  beforeEach(async () => {
    gs = { getAll: vi.fn(), create: vi.fn() } as unknown as MockedObject<GlobalService>;
    gs.getAll.mockReturnValue(NEVER);
    alert = { showSuccessMessage: vi.fn() } as unknown as MockedObject<AlertService>;
    router = { navigate: vi.fn().mockResolvedValue(true) } as unknown as MockedObject<Router>;
    await TestBed.configureTestingModule({
      declarations: [NewPreconfiguredTasksComponent],
      providers: [
        { provide: GlobalService, useValue: gs },
        { provide: AlertService, useValue: alert },
        { provide: AutoTitleService, useValue: { set: vi.fn() } },
        { provide: Router, useValue: router },
        { provide: UIConfigService, useValue: { getUISettings: () => ({ hashlistAlias: '#HL#' }) } },
        { provide: ActivatedRoute, useValue: { params: of({}), data: of({ kind: NewPretaskRouteKind.NewPretask }) } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(NewPreconfiguredTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('initializes a new pretask form and loads cracker types', () => {
    expect(component.whichView).toBe('create');
    expect(component.copyMode).toBe(false);
    expect(component.createForm.controls.attackCmd.value).toBe('#HL#');
    expect(gs.getAll).toHaveBeenCalledWith(SERV.CRACKERS_TYPES, { include: ['crackerVersions'] });
  });

  it('updates the attack command and file selection from the file picker', () => {
    component.onUpdateForm({ attackCmd: '-a 0 #HL# dict.txt', files: [4, 9] } as never);
    expect(component.getFormData()).toEqual({ attackCmd: '-a 0 #HL# dict.txt', files: [4, 9] });
  });

  it('marks the form touched and skips submission when invalid', () => {
    const touched = vi.spyOn(component.createForm, 'markAllAsTouched');
    component.onSubmit();
    expect(touched).toHaveBeenCalled();
    expect(gs.create).not.toHaveBeenCalled();
  });

  it('creates a valid pretask and navigates after success', () => {
    gs.create.mockReturnValue(of(mockResponse()));
    component.createForm.patchValue({ taskName: 'Sample', attackCmd: '-a 0 #HL# words.txt' });
    component.onSubmit();
    expect(gs.create).toHaveBeenCalledWith(SERV.PRETASKS, expect.objectContaining({ taskName: 'Sample' }));
    expect(alert.showSuccessMessage).toHaveBeenCalledWith('New Preconfigured Task created');
    expect(router.navigate).toHaveBeenCalledWith(['tasks/preconfigured-tasks']);
    expect(component.isCreatingLoading).toBe(false);
  });
});
