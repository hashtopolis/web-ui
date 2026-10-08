import { zPreTaskListResponse } from '@generated/api/zod';
import { of } from 'rxjs';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { ResponseWrapper } from '@models/response.model';

import { CrackerBinaryTypesService } from '@services/crackers/cracker-binary-types.service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

import { NewSupertasksComponent } from '@components/forms/custom-forms/task/new-supertasks/new-supertasks.component';

import { mockValidResponse } from '@src/app/testing/mock-response';

function pretask(id: number, taskName: string, crackerBinaryTypeId: number) {
  return {
    id,
    type: 'preTask' as const,
    attributes: {
      taskName,
      attackCmd: '#HL# wordlist.txt',
      chunkTime: 600,
      statusTimer: 5,
      color: '',
      isSmall: false,
      isCpuTask: false,
      useNewBench: true,
      priority: 0,
      maxAgents: 0,
      isMaskImport: false,
      crackerBinaryTypeId
    }
  };
}

const PRETASKS = mockValidResponse(zPreTaskListResponse, {
  data: [pretask(2, 'hashcat pretask', 1), pretask(3, 'generic pretask', 2)]
});

describe('NewSupertasksComponent', () => {
  let fixture: ComponentFixture<NewSupertasksComponent>;
  let component: NewSupertasksComponent;
  let gs: jasmine.SpyObj<GlobalService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    gs = jasmine.createSpyObj('GlobalService', ['getAll', 'create']);
    gs.getAll.and.returnValue(of(PRETASKS));
    gs.create.and.returnValue(of({} as ResponseWrapper));
    router = jasmine.createSpyObj('Router', ['navigate']);
    const crackerBinaryTypes = jasmine.createSpyObj('CrackerBinaryTypesService', ['getTypes']);
    crackerBinaryTypes.getTypes.and.returnValue(
      of([
        { id: 2, typeName: 'generic' },
        { id: 1, typeName: 'hashcat' }
      ])
    );

    await TestBed.configureTestingModule({
      declarations: [NewSupertasksComponent],
      providers: [
        { provide: GlobalService, useValue: gs },
        { provide: Router, useValue: router },
        { provide: CrackerBinaryTypesService, useValue: crackerBinaryTypes },
        { provide: AlertService, useValue: jasmine.createSpyObj('AlertService', ['showSuccessMessage']) },
        { provide: AutoTitleService, useValue: jasmine.createSpyObj('AutoTitleService', ['set']) }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(NewSupertasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('preselects hashcat and offers only its pretasks', () => {
    expect(component.selectCrackerTypes.map((option) => option.id)).toEqual([2, 1]);
    expect(component.form.controls.crackerBinaryTypeId.value).toBe(1);
    expect(component.selectPretasks.map((option) => option.id)).toEqual([2]);
    expect(component.isLoading).toBeFalse();
  });

  it('clears the pretasks when the type changes', () => {
    component.form.controls.pretasks.setValue([2]);

    component.form.controls.crackerBinaryTypeId.setValue(2);

    expect(component.form.controls.pretasks.value).toEqual([]);
    expect(component.selectPretasks.map((option) => option.id)).toEqual([3]);
    expect(component.form.valid).toBeFalse();
  });

  it('sends the type with the supertask', () => {
    component.form.controls.supertaskName.setValue('BF set');
    component.form.controls.pretasks.setValue([2]);

    component.onSubmit();

    expect(gs.create).toHaveBeenCalledWith(SERV.SUPER_TASKS, {
      supertaskName: 'BF set',
      crackerBinaryTypeId: 1,
      pretasks: [2]
    });
    expect(router.navigate).toHaveBeenCalledWith(['tasks/supertasks']);
  });

  it('sends nothing while the form is invalid', () => {
    component.form.controls.supertaskName.setValue('BF set');

    component.onSubmit();

    expect(gs.create).not.toHaveBeenCalled();
    expect(component.form.controls.pretasks.touched).toBeTrue();
  });
});
