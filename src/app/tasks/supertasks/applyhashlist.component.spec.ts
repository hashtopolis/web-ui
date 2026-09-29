import { zCrackerBinaryListResponse, zCrackerBinaryTypeListResponse, zHashlistListResponse } from '@generated/api/zod';
import { Observable, of, throwError } from 'rxjs';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { ResponseWrapper } from '@models/response.model';

import { SERV, ServiceConfig } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

import { ApplyHashlistComponent } from '@src/app/tasks/supertasks/applyhashlist.component';
import { mockValidResponse } from '@src/app/testing/mock-response';

const HASHLISTS = mockValidResponse(zHashlistListResponse, { data: [] });
const EMPTY_VERSIONS = mockValidResponse(zCrackerBinaryListResponse, { data: [] });

function types(withVersions: boolean): ResponseWrapper {
  return mockValidResponse(zCrackerBinaryTypeListResponse, {
    data: [
      {
        id: 1,
        type: 'crackerBinaryType',
        attributes: { typeName: 'hashcat', isChunkingAvailable: true },
        relationships: { crackerVersions: { data: withVersions ? [{ type: 'crackerBinary', id: 10 }] : [] } }
      },
      {
        id: 2,
        type: 'crackerBinaryType',
        attributes: { typeName: 'generic', isChunkingAvailable: true },
        relationships: { crackerVersions: { data: [] } }
      }
    ],
    included: withVersions
      ? [
          {
            id: 10,
            type: 'crackerBinary',
            attributes: {
              crackerBinaryTypeId: 1,
              binaryName: 'hashcat',
              version: '6.2.6',
              downloadUrl: '',
              filename: null,
              accessGroupId: 1
            }
          }
        ]
      : []
  });
}

const VERSIONS = mockValidResponse(zCrackerBinaryListResponse, {
  data: [
    {
      id: 10,
      type: 'crackerBinary',
      attributes: {
        crackerBinaryTypeId: 1,
        binaryName: 'hashcat',
        version: '6.2.6',
        downloadUrl: '',
        filename: null,
        accessGroupId: 1
      }
    }
  ]
});

describe('ApplyHashlistComponent', () => {
  let fixture: ComponentFixture<ApplyHashlistComponent>;
  let component: ApplyHashlistComponent;
  let gs: jasmine.SpyObj<GlobalService>;
  let responses: Record<string, ResponseWrapper>;

  beforeEach(async () => {
    gs = jasmine.createSpyObj('GlobalService', ['getAll', 'chelper']);
    gs.getAll.and.callFake((config: ServiceConfig): Observable<ResponseWrapper> => of(responses[config.URL]));

    await TestBed.configureTestingModule({
      declarations: [ApplyHashlistComponent],
      providers: [
        { provide: GlobalService, useValue: gs },
        { provide: ActivatedRoute, useValue: { params: of({ id: 5 }) } },
        {
          provide: AlertService,
          useValue: jasmine.createSpyObj('AlertService', ['showErrorMessage', 'showSuccessMessage'])
        },
        { provide: AutoTitleService, useValue: jasmine.createSpyObj('AutoTitleService', ['set']) },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  function create(): void {
    fixture = TestBed.createComponent(ApplyHashlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('lists only types with accessible versions and selects the last version', () => {
    responses = {
      [SERV.HASHLISTS.URL]: HASHLISTS,
      [SERV.CRACKERS_TYPES.URL]: types(true),
      [SERV.CRACKERS.URL]: VERSIONS
    };
    create();
    expect(component.selectCrackertype.map((o) => o.id)).toEqual([1]);
    expect(component.form.controls.crackerBinaryId.value).toBe(1);
    expect(component.form.controls.crackerBinaryTypeId.value).toBe(10);
    expect(component.noCrackerVersionsAvailable).toBeFalse();
  });

  it('does not throw and flags when no type has accessible versions', () => {
    responses = {
      [SERV.HASHLISTS.URL]: HASHLISTS,
      [SERV.CRACKERS_TYPES.URL]: types(false),
      [SERV.CRACKERS.URL]: EMPTY_VERSIONS
    };
    expect(() => create()).not.toThrow();
    expect(component.selectCrackertype).toEqual([]);
    expect(component.noCrackerVersionsAvailable).toBeTrue();
  });

  it('does not throw when a type change returns no versions', () => {
    responses = {
      [SERV.HASHLISTS.URL]: HASHLISTS,
      [SERV.CRACKERS_TYPES.URL]: types(true),
      [SERV.CRACKERS.URL]: VERSIONS
    };
    create();
    responses[SERV.CRACKERS.URL] = EMPTY_VERSIONS;
    expect(() => component.handleChangeBinary(2)).not.toThrow();
    expect(component.form.controls.crackerBinaryTypeId.value).toBeNull();
    expect(component.noCrackerVersionsAvailable).toBeTrue();
  });

  it('does not submit without a cracker version', () => {
    responses = {
      [SERV.HASHLISTS.URL]: HASHLISTS,
      [SERV.CRACKERS_TYPES.URL]: types(false),
      [SERV.CRACKERS.URL]: EMPTY_VERSIONS
    };
    create();
    component.form.controls.hashlistId.setValue(1);
    component.onSubmit();
    expect(gs.chelper).not.toHaveBeenCalled();
  });

  it('stops the loading spinner when creating the supertask fails', () => {
    responses = {
      [SERV.HASHLISTS.URL]: HASHLISTS,
      [SERV.CRACKERS_TYPES.URL]: types(true),
      [SERV.CRACKERS.URL]: VERSIONS
    };
    create();
    gs.chelper.and.returnValue(throwError(() => new Error('rejected')));
    component.form.controls.hashlistId.setValue(1);
    component.onSubmit();
    expect(gs.chelper).toHaveBeenCalled();
    expect(component.isCreatingLoading).toBeFalse();
  });
});
