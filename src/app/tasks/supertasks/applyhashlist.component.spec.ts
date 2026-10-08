import { zCrackerBinaryListResponse, zCrackerBinaryTypeListResponse, zHashlistListResponse } from '@generated/api/zod';
import { Observable, Subject, of, throwError } from 'rxjs';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { ResponseWrapper } from '@models/response.model';

import {
  CrackerHashtypeSupportService,
  buildUnsupportedHashtypeMessage
} from '@services/crackers/cracker-hashtype-support.service';
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

const NTLM_HASHLISTS = mockValidResponse(zHashlistListResponse, {
  data: [
    {
      id: 1,
      type: 'hashlist',
      attributes: {
        name: 'ntlm',
        format: 0,
        hashTypeId: 1000,
        hashCount: 0,
        separator: null,
        cracked: 0,
        isSecret: false,
        isHexSalt: false,
        isSalted: false,
        accessGroupId: 1,
        notes: '',
        useBrain: false,
        brainFeatures: 0,
        isArchived: false
      }
    }
  ]
});

function version(id: number) {
  return {
    id,
    type: 'crackerBinary' as const,
    attributes: {
      crackerBinaryTypeId: 1,
      binaryName: 'hashcat',
      version: `${id}`,
      downloadUrl: '',
      filename: null,
      accessGroupId: 1
    }
  };
}

const TYPES_10_11 = mockValidResponse(zCrackerBinaryTypeListResponse, {
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
    }
  ],
  included: [version(10), version(11)]
});

const VERSIONS_10_11 = mockValidResponse(zCrackerBinaryListResponse, { data: [version(10), version(11)] });

describe('ApplyHashlistComponent', () => {
  let fixture: ComponentFixture<ApplyHashlistComponent>;
  let component: ApplyHashlistComponent;
  let gs: jasmine.SpyObj<GlobalService>;
  let responses: Record<string, ResponseWrapper>;
  let support: jasmine.SpyObj<CrackerHashtypeSupportService>;

  beforeEach(async () => {
    gs = jasmine.createSpyObj('GlobalService', ['getAll', 'chelper']);
    gs.getAll.and.callFake((config: ServiceConfig): Observable<ResponseWrapper> => of(responses[config.URL]));

    support = jasmine.createSpyObj('CrackerHashtypeSupportService', ['getSupportedCrackerBinaryIds']);
    support.getSupportedCrackerBinaryIds.and.returnValue(of(new Set([10, 11])));

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
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
        { provide: CrackerHashtypeSupportService, useValue: support }
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

  describe('hashtype support', () => {
    beforeEach(() => {
      responses = {
        [SERV.HASHLISTS.URL]: NTLM_HASHLISTS,
        [SERV.CRACKERS_TYPES.URL]: TYPES_10_11,
        [SERV.CRACKERS.URL]: VERSIONS_10_11
      };
    });

    it('offers only the versions supporting the hashtype of the selected hashlist', () => {
      support.getSupportedCrackerBinaryIds.and.returnValue(of(new Set([10])));
      create();

      component.handleChangeHashlist(1);

      expect(support.getSupportedCrackerBinaryIds).toHaveBeenCalledWith(1000);
      expect(component.selectCrackerversions.map((o) => o.id)).toEqual([10]);
      expect(component.form.controls.crackerBinaryTypeId.value).toBe(10);
      expect(component.unsupportedHashtypeMessage).toBeNull();
    });

    it('blocks when no version supports the hashtype', () => {
      support.getSupportedCrackerBinaryIds.and.returnValue(of(new Set<number>()));
      create();
      component.form.controls.hashlistId.setValue(1, { emitEvent: false });

      component.handleChangeHashlist(1);
      fixture.detectChanges();
      component.onSubmit();

      expect(component.selectCrackertype).toEqual([]);
      expect(component.form.controls.crackerBinaryTypeId.value).toBeNull();
      expect(component.unsupportedHashtypeMessage).toBe(buildUnsupportedHashtypeMessage(1000));
      expect(fixture.nativeElement.querySelector('[data-testid="unsupported-hashtype"]')).toBeTruthy();
      expect(gs.chelper).not.toHaveBeenCalled();
    });

    function twoTypes(): ResponseWrapper {
      return mockValidResponse(zCrackerBinaryTypeListResponse, {
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
        included: [
          version(10),
          version(11),
          { ...version(20), attributes: { ...version(20).attributes, crackerBinaryTypeId: 2 } }
        ]
      });
    }

    it('applies a hashlist chosen before the cracker types loaded once they arrive', () => {
      const typesResponse = new Subject<ResponseWrapper>();
      gs.getAll.and.callFake((config: ServiceConfig): Observable<ResponseWrapper> =>
        config.URL === SERV.CRACKERS_TYPES.URL ? typesResponse : of(responses[config.URL])
      );
      support.getSupportedCrackerBinaryIds.and.returnValue(of(new Set([10])));
      create();

      component.form.controls.hashlistId.setValue(1);
      typesResponse.next(twoTypes());

      expect(component.selectCrackertype.map((o) => o.id)).toEqual([1]);
      expect(component.form.controls.crackerBinaryTypeId.value).toBe(10);
    });

    it('shows the hashtype message when blocked before the cracker types loaded', () => {
      const typesResponse = new Subject<ResponseWrapper>();
      gs.getAll.and.callFake((config: ServiceConfig): Observable<ResponseWrapper> =>
        config.URL === SERV.CRACKERS_TYPES.URL ? typesResponse : of(responses[config.URL])
      );
      support.getSupportedCrackerBinaryIds.and.returnValue(of(new Set<number>()));
      create();

      component.form.controls.hashlistId.setValue(1);
      typesResponse.next(twoTypes());

      expect(component.unsupportedHashtypeMessage).toBe(buildUnsupportedHashtypeMessage(1000));
      expect(component.noCrackerVersionsAvailable).toBeFalse();
    });

    it('blocks when loading the versions fails', () => {
      spyOn(console, 'error');
      create();
      gs.getAll.and.callFake((config: ServiceConfig): Observable<ResponseWrapper> =>
        config.URL === SERV.CRACKERS.URL ? throwError(() => new Error('down')) : of(responses[config.URL])
      );

      component.handleChangeHashlist(1);

      expect(component.selectCrackerversions).toEqual([]);
      expect(component.form.controls.crackerBinaryTypeId.value).toBeNull();
    });

    it('keeps the version pending while the support lookup runs', () => {
      const lookup = new Subject<Set<number>>();
      support.getSupportedCrackerBinaryIds.and.returnValue(lookup);
      create();

      component.handleChangeHashlist(1);
      expect(component.form.controls.crackerBinaryTypeId.pending).toBeTrue();

      lookup.next(new Set([10]));
      expect(component.form.controls.crackerBinaryTypeId.pending).toBeFalse();
      expect(component.form.controls.crackerBinaryTypeId.value).toBe(10);
    });

    it('cancels the lookup of a previously selected hashlist', () => {
      const firstLookup = new Subject<Set<number>>();
      support.getSupportedCrackerBinaryIds.and.returnValue(firstLookup);
      create();

      component.handleChangeHashlist(1);
      expect(firstLookup.observed).toBeTrue();
      component.handleChangeHashlist(null);

      expect(firstLookup.observed).toBeFalse();
      expect(component.selectCrackerversions.map((o) => o.id)).toEqual([10, 11]);
    });
  });
});
