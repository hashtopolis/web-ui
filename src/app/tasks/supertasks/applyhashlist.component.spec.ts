import { zCrackerBinaryListResponse, zHashlistListResponse, zSupertaskResponse } from '@generated/api/zod';
import { Observable, Subject, of, throwError } from 'rxjs';
import type { MockedObject } from 'vitest';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { FilterType, RequestParams } from '@models/request-params.model';
import { ResponseWrapper } from '@models/response.model';

import { CrackerBinaryTypesService } from '@services/crackers/cracker-binary-types.service';
import {
  CrackerHashtypeSupportService,
  SUPPORT_LOOKUP_FAILED,
  buildUnsupportedHashtypeMessage
} from '@services/crackers/cracker-hashtype-support.service';
import { SERV, ServiceConfig } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

import { ApplyHashlistComponent } from '@src/app/tasks/supertasks/applyhashlist.component';
import { mockValidResponse } from '@src/app/testing/mock-response';

const SUPERTASK = mockValidResponse(zSupertaskResponse, {
  data: { id: 5, type: 'supertask', attributes: { supertaskName: 'BF set', crackerBinaryTypeId: 1 } }
});

const EMPTY_VERSIONS = mockValidResponse(zCrackerBinaryListResponse, { data: [] });

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

const VERSIONS_10_11 = mockValidResponse(zCrackerBinaryListResponse, { data: [version(10), version(11)] });

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

describe('ApplyHashlistComponent', () => {
  let fixture: ComponentFixture<ApplyHashlistComponent>;
  let component: ApplyHashlistComponent;
  let gs: MockedObject<GlobalService>;
  let responses: Record<string, ResponseWrapper>;
  let support: MockedObject<CrackerHashtypeSupportService>;
  let crackerBinaryTypes: MockedObject<CrackerBinaryTypesService>;

  beforeEach(async () => {
    gs = {
      get: vi.fn().mockName('GlobalService.get'),
      getAll: vi.fn().mockName('GlobalService.getAll'),
      chelper: vi.fn().mockName('GlobalService.chelper')
    } as MockedObject<GlobalService>;
    gs.get.mockImplementation((): Observable<ResponseWrapper> => of(SUPERTASK));
    gs.getAll.mockImplementation((config: ServiceConfig): Observable<ResponseWrapper> => of(responses[config.URL]));

    support = {
      getSupportedCrackerBinaryIds: vi.fn().mockName('CrackerHashtypeSupportService.getSupportedCrackerBinaryIds')
    } as MockedObject<CrackerHashtypeSupportService>;
    support.getSupportedCrackerBinaryIds.mockReturnValue(of(new Set([10, 11])));

    crackerBinaryTypes = {
      getTypeName: vi.fn().mockName('CrackerBinaryTypesService.getTypeName')
    } as MockedObject<CrackerBinaryTypesService>;
    crackerBinaryTypes.getTypeName.mockReturnValue(of('hashcat'));

    responses = {
      [SERV.HASHLISTS.URL]: NTLM_HASHLISTS,
      [SERV.CRACKERS.URL]: VERSIONS_10_11
    };

    await TestBed.configureTestingModule({
      declarations: [ApplyHashlistComponent],
      providers: [
        { provide: GlobalService, useValue: gs },
        { provide: ActivatedRoute, useValue: { params: of({ id: 5 }) } },
        {
          provide: AlertService,
          useValue: {
            showErrorMessage: vi.fn().mockName('AlertService.showErrorMessage'),
            showSuccessMessage: vi.fn().mockName('AlertService.showSuccessMessage')
          }
        },
        {
          provide: AutoTitleService,
          useValue: {
            set: vi.fn().mockName('AutoTitleService.set')
          }
        },
        {
          provide: Router,
          useValue: {
            navigate: vi.fn().mockName('Router.navigate')
          }
        },
        { provide: CrackerHashtypeSupportService, useValue: support },
        { provide: CrackerBinaryTypesService, useValue: crackerBinaryTypes }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  function create(): void {
    fixture = TestBed.createComponent(ApplyHashlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  function versionsRequest(): RequestParams {
    const call = gs.getAll.mock.calls.find((c) => (c[0] as ServiceConfig).URL === SERV.CRACKERS.URL);
    return call?.[1] as RequestParams;
  }

  it('shows the supertask and its type read-only and selects the newest version of the type', () => {
    create();

    expect(gs.get.mock.lastCall!.slice(0, 2)).toEqual([SERV.SUPER_TASKS, 5]);
    expect(crackerBinaryTypes.getTypeName).toHaveBeenCalledWith(1);
    expect(component.form.controls.supertaskName.value).toBe('BF set');
    expect(component.form.controls.supertaskName.disabled).toBe(true);
    expect(component.form.controls.crackerBinaryType.value).toBe('hashcat');
    expect(component.form.controls.crackerBinaryType.disabled).toBe(true);
    expect(versionsRequest().filter).toEqual([{ field: 'crackerBinaryTypeId', operator: FilterType.EQUAL, value: 1 }]);
    expect(gs.getAll.mock.calls.some((c) => (c[0] as ServiceConfig).URL === SERV.CRACKERS_TYPES.URL)).toBe(false);
    expect(component.selectCrackerversions.map((o) => o.id)).toEqual([10, 11]);
    expect(component.form.controls.crackerBinaryId.value).toBe(11);
    expect(component.noCrackerVersionsAvailable).toBe(false);
  });

  it('flags when the type has no accessible version', () => {
    responses[SERV.CRACKERS.URL] = EMPTY_VERSIONS;
    expect(() => create()).not.toThrow();
    expect(component.selectCrackerversions).toEqual([]);
    expect(component.form.controls.crackerBinaryId.value).toBeNull();
    expect(component.noCrackerVersionsAvailable).toBe(true);
    expect(component.unsupportedHashtypeMessage).toBeNull();
  });

  it('fails closed when loading the supertask fails', () => {
    vi.spyOn(console, 'error').mockReturnValue(undefined);
    gs.get.mockReturnValue(throwError(() => new Error('down')));
    create();

    component.handleChangeHashlist(1);
    component.onSubmit();

    expect(component.form.controls.crackerBinaryId.pending).toBe(false);
    expect(component.form.controls.crackerBinaryId.value).toBeNull();
    expect(component.noCrackerVersionsAvailable).toBe(true);
    expect(gs.chelper).not.toHaveBeenCalled();
  });

  it('does not submit without a cracker version', () => {
    responses[SERV.CRACKERS.URL] = EMPTY_VERSIONS;
    create();
    component.form.controls.hashlistId.setValue(1);
    component.onSubmit();
    expect(gs.chelper).not.toHaveBeenCalled();
  });

  it('submits the selected version of the supertask', () => {
    gs.chelper.mockReturnValue(of({}) as unknown as ReturnType<GlobalService['chelper']>);
    create();
    component.form.controls.hashlistId.setValue(1);

    component.onSubmit();

    expect(gs.chelper).toHaveBeenCalledWith(SERV.HELPER, 'createSupertask', {
      supertaskTemplateId: 5,
      hashlistId: 1,
      crackerVersionId: 11
    });
  });

  it('stops the loading spinner when creating the supertask fails', () => {
    create();
    gs.chelper.mockReturnValue(throwError(() => new Error('rejected')));
    component.form.controls.hashlistId.setValue(1);
    component.onSubmit();
    expect(gs.chelper).toHaveBeenCalled();
    expect(component.isCreatingLoading).toBe(false);
  });

  describe('hashtype support', () => {
    it('offers only the versions supporting the hashtype of the selected hashlist', () => {
      support.getSupportedCrackerBinaryIds.mockReturnValue(of(new Set([10])));
      create();

      component.handleChangeHashlist(1);

      expect(support.getSupportedCrackerBinaryIds).toHaveBeenCalledWith(1000);
      expect(component.selectCrackerversions.map((o) => o.id)).toEqual([10]);
      expect(component.form.controls.crackerBinaryId.value).toBe(10);
      expect(component.unsupportedHashtypeMessage).toBeNull();
    });

    it('keeps the selected version when it is still supported', () => {
      create();
      component.form.controls.crackerBinaryId.setValue(10);
      support.getSupportedCrackerBinaryIds.mockReturnValue(of(new Set([10, 11])));

      component.handleChangeHashlist(1);

      expect(component.form.controls.crackerBinaryId.value).toBe(10);
    });

    it('blocks when no version of the type supports the hashtype', () => {
      support.getSupportedCrackerBinaryIds.mockReturnValue(of(new Set<number>()));
      create();
      component.form.controls.hashlistId.setValue(1, { emitEvent: false });

      component.handleChangeHashlist(1);
      fixture.detectChanges();
      component.onSubmit();

      expect(component.selectCrackerversions).toEqual([]);
      expect(component.form.controls.crackerBinaryId.value).toBeNull();
      expect(component.unsupportedHashtypeMessage).toBe(buildUnsupportedHashtypeMessage(1000));
      expect(component.noCrackerVersionsAvailable).toBe(false);
      expect(fixture.nativeElement.querySelector('[data-testid="unsupported-hashtype"]')).toBeTruthy();
      expect(gs.chelper).not.toHaveBeenCalled();
    });

    it('shows no required hint on a version select the user opened before the block', () => {
      support.getSupportedCrackerBinaryIds.mockReturnValue(of(new Set<number>()));
      create();
      component.form.controls.crackerBinaryId.markAsTouched();

      component.handleChangeHashlist(1);

      expect(component.form.controls.crackerBinaryId.touched).toBe(false);
    });

    it('says the check failed when the support lookup failed', () => {
      support.getSupportedCrackerBinaryIds.mockReturnValue(of(SUPPORT_LOOKUP_FAILED));
      create();

      component.handleChangeHashlist(1);

      expect(component.form.controls.crackerBinaryId.value).toBeNull();
      expect(component.unsupportedHashtypeMessage).toBe(
        'Could not check which cracker versions support hashtype 1000.'
      );
    });

    it('applies a hashlist chosen before the versions loaded once they arrive', () => {
      const versionsResponse = new Subject<ResponseWrapper>();
      gs.getAll.mockImplementation((config: ServiceConfig): Observable<ResponseWrapper> =>
        config.URL === SERV.CRACKERS.URL ? versionsResponse : of(responses[config.URL])
      );
      support.getSupportedCrackerBinaryIds.mockReturnValue(of(new Set([10])));
      create();

      component.form.controls.hashlistId.setValue(1);
      expect(component.form.controls.crackerBinaryId.pending).toBe(true);
      versionsResponse.next(VERSIONS_10_11);

      expect(component.selectCrackerversions.map((o) => o.id)).toEqual([10]);
      expect(component.form.controls.crackerBinaryId.value).toBe(10);
      expect(component.form.controls.crackerBinaryId.pending).toBe(false);
    });

    it('fails closed when loading the versions fails', () => {
      vi.spyOn(console, 'error').mockReturnValue(undefined);
      gs.getAll.mockImplementation((config: ServiceConfig): Observable<ResponseWrapper> =>
        config.URL === SERV.CRACKERS.URL ? throwError(() => new Error('down')) : of(responses[config.URL])
      );

      create();
      component.handleChangeHashlist(1);
      component.onSubmit();

      expect(component.form.controls.crackerBinaryId.pending).toBe(false);
      expect(component.form.controls.crackerBinaryId.value).toBeNull();
      expect(component.noCrackerVersionsAvailable).toBe(true);
      expect(gs.chelper).not.toHaveBeenCalled();
    });

    it('keeps the version pending while the support lookup runs', () => {
      const lookup = new Subject<Set<number>>();
      support.getSupportedCrackerBinaryIds.mockReturnValue(lookup);
      create();

      component.handleChangeHashlist(1);
      expect(component.form.controls.crackerBinaryId.pending).toBe(true);

      lookup.next(new Set([10]));
      expect(component.form.controls.crackerBinaryId.pending).toBe(false);
      expect(component.form.controls.crackerBinaryId.value).toBe(10);
    });

    it('cancels the lookup of a previously selected hashlist', () => {
      const firstLookup = new Subject<Set<number>>();
      support.getSupportedCrackerBinaryIds.mockReturnValue(firstLookup);
      create();

      component.handleChangeHashlist(1);
      expect(firstLookup.observed).toBe(true);
      component.handleChangeHashlist(null);

      expect(firstLookup.observed).toBe(false);
      expect(component.selectCrackerversions.map((o) => o.id)).toEqual([10, 11]);
    });
  });
});
