import { zGetAccessGroupsHelperApiResponse, zHashlistResponse } from '@generated/api/zod';
import { of } from 'rxjs';
import type { MockedObject } from 'vitest';

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideLocationMocks } from '@angular/common/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { ResponseWrapper } from '@models/response.model';

import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { HashListRoleService } from '@services/roles/hashlists/hashlist-role.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';
import { ConfigService } from '@services/shared/config.service';
import { UnsavedChangesService } from '@services/shared/unsaved-changes.service';

import { StaticArrayPipe } from '@src/app/core/_pipes/static-array.pipe';
import { EditHashlistComponent } from '@src/app/hashlists/edit-hashlist/edit-hashlist.component';
import { ButtonsModule } from '@src/app/shared/buttons/buttons.module';
import { ComponentsModule } from '@src/app/shared/components.module';
import { InputModule } from '@src/app/shared/input/input.module';
import { InputTextComponent } from '@src/app/shared/input/text/text.component';
import { PageSubTitleComponent } from '@src/app/shared/page-headers/page-subtitle/page-subtitle.component';
import { mockValidResponse } from '@src/app/testing/mock-response';

const mockHashlistResponse = (): ResponseWrapper =>
  mockValidResponse(zHashlistResponse, {
    data: {
      id: 1,
      type: 'hashlist',
      attributes: {
        name: 'Test Hashlist',
        notes: 'Test notes',
        isSecret: false,
        useBrain: false,
        format: 0,
        hashTypeId: 0,
        hashCount: 1000,
        cracked: 500,
        separator: ':',
        isHexSalt: false,
        isSalted: false,
        accessGroupId: 1,
        brainFeatures: 0,
        isArchived: false
      },
      relationships: {
        hashType: {
          data: { id: 0, type: 'hashType' }
        }
      }
    },
    included: [
      {
        id: 0,
        type: 'hashType',
        attributes: {
          description: 'MD5',
          isSalted: false,
          isSlowHash: false
        }
      }
    ]
  }) as ResponseWrapper;

const mockSuperHashlistResponse = (): ResponseWrapper =>
  mockValidResponse(zHashlistResponse, {
    data: {
      id: 1,
      type: 'hashlist',
      attributes: {
        name: 'Super Hashlist',
        notes: '',
        isSecret: false,
        useBrain: false,
        format: 3,
        hashTypeId: 0,
        hashCount: 1000,
        cracked: 500,
        separator: ':',
        isHexSalt: false,
        isSalted: false,
        accessGroupId: 1,
        brainFeatures: 0,
        isArchived: false
      },
      relationships: {
        hashType: { data: { id: 0, type: 'hashType' } }
      }
    },
    included: [
      {
        id: 0,
        type: 'hashType',
        attributes: { description: 'MD5', isSalted: false, isSlowHash: false }
      }
    ]
  }) as ResponseWrapper;

const mockAccessGroupsResponse: ResponseWrapper = mockValidResponse(zGetAccessGroupsHelperApiResponse, {
  data: [
    { id: 1, type: 'accessGroup', attributes: { groupName: 'Admin' } },
    { id: 2, type: 'accessGroup', attributes: { groupName: 'User' } }
  ]
}) as ResponseWrapper;

describe('EditHashlistComponent', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });
  let component: EditHashlistComponent;
  let fixture: ComponentFixture<EditHashlistComponent>;
  let httpMock: HttpTestingController;

  let gsSpy: MockedObject<GlobalService>;
  let alertSpy: MockedObject<AlertService>;
  let titleSpy: MockedObject<AutoTitleService>;
  let routerSpy: MockedObject<Router>;
  let configSpy: MockedObject<ConfigService>;
  let unsavedChangesSpy: MockedObject<UnsavedChangesService>;
  let roleServiceSpy: MockedObject<HashListRoleService>;

  beforeEach(async () => {
    gsSpy = {
      get: vi.fn().mockName('GlobalService.get'),
      ghelper: vi.fn().mockName('GlobalService.ghelper'),
      update: vi.fn().mockName('GlobalService.update'),
      chelper: vi.fn().mockName('GlobalService.chelper')
    } as MockedObject<GlobalService>;
    Object.defineProperty(gsSpy, 'userId', { get: () => 1 });
    alertSpy = {
      showSuccessMessage: vi.fn().mockName('AlertService.showSuccessMessage'),
      showErrorMessage: vi.fn().mockName('AlertService.showErrorMessage')
    } as MockedObject<AlertService>;
    titleSpy = {
      set: vi.fn().mockName('AutoTitleService.set')
    } as MockedObject<AutoTitleService>;
    routerSpy = {
      navigate: vi.fn().mockName('Router.navigate'),
      navigateByUrl: vi.fn().mockName('Router.navigateByUrl'),
      createUrlTree: vi.fn().mockName('Router.createUrlTree'),
      serializeUrl: vi.fn().mockName('Router.serializeUrl'),
      events: of()
    } as unknown as MockedObject<Router>;
    configSpy = {
      getEndpoint: vi.fn().mockName('ConfigService.getEndpoint')
    } as MockedObject<ConfigService>;
    unsavedChangesSpy = {
      setUnsavedChanges: vi.fn().mockName('UnsavedChangesService.setUnsavedChanges')
    } as MockedObject<UnsavedChangesService>;
    roleServiceSpy = {
      hasRole: vi.fn().mockName('HashListRoleService.hasRole')
    } as MockedObject<HashListRoleService>;

    configSpy.getEndpoint.mockReturnValue('http://localhost:8080/api/v2');

    await TestBed.configureTestingModule({
      declarations: [EditHashlistComponent, PageSubTitleComponent],
      imports: [
        ReactiveFormsModule,
        InputModule,
        ButtonsModule,
        ComponentsModule,
        MatProgressBarModule,
        MatIconModule,
        MatExpansionModule
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        StaticArrayPipe,
        { provide: GlobalService, useValue: gsSpy },
        { provide: AlertService, useValue: alertSpy },
        { provide: AutoTitleService, useValue: titleSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ConfigService, useValue: configSpy },
        { provide: UnsavedChangesService, useValue: unsavedChangesSpy },
        { provide: HashListRoleService, useValue: roleServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: { params: of({ id: '1' }) }
        },
        provideLocationMocks()
      ]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  beforeEach(() => {
    roleServiceSpy.hasRole.mockReturnValue(true);
    gsSpy.ghelper.mockReturnValue(of(mockAccessGroupsResponse));
  });

  afterEach(() => {
    httpMock.verify();
  });

  const initComponent = () => {
    fixture = TestBed.createComponent(EditHashlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  const respondToHashlistRequest = (response: ResponseWrapper) => {
    const req = httpMock.expectOne((request) => request.url.includes('/hashlists/') && request.params.has('include'));
    req.flush(response);
  };

  describe('Component initialization', () => {
    it('should create component and initialize form', () => {
      initComponent();
      respondToHashlistRequest(mockHashlistResponse());

      expect(component).toBeTruthy();
      expect(component.updateForm).toBeDefined();
      expect(component.updateForm.get('hashlistId')).toBeDefined();
      expect(component.updateForm.get('updateData')).toBeDefined();
    });

    it('should set title on construction', () => {
      initComponent();
      respondToHashlistRequest(mockHashlistResponse());

      expect(titleSpy.set).toHaveBeenCalledWith(['Edit Hashlist']);
    });
  });

  describe('ngOnInit', () => {
    it('should load hashlist and data successfully', async () => {
      initComponent();
      respondToHashlistRequest(mockHashlistResponse());
      await vi.advanceTimersByTimeAsync(0);

      expect(component.isLoading).toBe(false);
      expect(component.editedHashlist).toBeDefined();
      expect(component.hashtype).toBeDefined();
    });

    it('should navigate to /forbidden on 403 error', async () => {
      initComponent();
      const req = httpMock.expectOne((request) => request.url.includes('/hashlists/'));
      req.flush('error', { status: 403, statusText: 'Forbidden' });
      await vi.advanceTimersByTimeAsync(0);

      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/forbidden');
      expect(component.isLoading).toBe(true);
    });

    it('should navigate to /not-found on 404 error', async () => {
      initComponent();
      const req = httpMock.expectOne((request) => request.url.includes('/hashlists/'));
      req.flush('error', { status: 404, statusText: 'Not Found' });
      await vi.advanceTimersByTimeAsync(0);

      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/not-found');
      expect(component.isLoading).toBe(true);
    });

    it('should show error message on 500+ error without redirect', async () => {
      fixture = TestBed.createComponent(EditHashlistComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      const allRequests = httpMock.match((req) => req.url.includes('/hashlists/'));
      allRequests[0].flush('error', { status: 500, statusText: 'Internal Server Error' });

      await vi.advanceTimersByTimeAsync(0);

      const retryRequests = httpMock.match((req) => req.url.includes('/hashlists/'));
      retryRequests[0].flush('error', { status: 500, statusText: 'Internal Server Error' });

      await vi.advanceTimersByTimeAsync(0);

      expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
      expect(alertSpy.showErrorMessage).toHaveBeenCalledWith(expect.stringContaining('Error loading hashlist'));
      expect(component.isLoading).toBe(false);
    });

    it('should show generic error message on non-HttpError error', async () => {
      initComponent();
      const req = httpMock.expectOne((request) => request.url.includes('/hashlists/'));
      req.error(new ProgressEvent('error'));
      await vi.advanceTimersByTimeAsync(0);

      expect(alertSpy.showErrorMessage).toHaveBeenCalledWith('Error loading hashlist.');
      expect(component.isLoading).toBe(false);
    });

    it('should retry without includes on 500 error from loadHashlist', async () => {
      fixture = TestBed.createComponent(EditHashlistComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      const allRequests = httpMock.match((req) => req.url.includes('/hashlists/'));
      allRequests[0].flush('error', { status: 500, statusText: 'Internal Server Error' });

      await vi.advanceTimersByTimeAsync(0);

      const retryRequests = httpMock.match((req) => req.url.includes('/hashlists/'));
      retryRequests[0].flush(mockHashlistResponse());

      await vi.advanceTimersByTimeAsync(0);

      expect(component.editedHashlist).toBeDefined();
      expect(component.isLoading).toBe(false);
    });

    it('should throw non-500 errors from loadHashlist and handle in ngOnInit', async () => {
      initComponent();
      const req = httpMock.expectOne((request) => request.url.includes('/hashlists/'));
      req.flush('error', { status: 404, statusText: 'Not Found' });
      await vi.advanceTimersByTimeAsync(0);

      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/not-found');
    });
  });

  describe('loadData', () => {
    it('should load access groups when user has groups role', async () => {
      initComponent();
      respondToHashlistRequest(mockHashlistResponse());
      await vi.advanceTimersByTimeAsync(0);

      expect(gsSpy.ghelper).toHaveBeenCalledWith(SERV.HELPER, 'getAccessGroups');
      expect(component.selectAccessgroup.length).toBe(2);
    });

    it('should not load access groups when user lacks groups role', async () => {
      vi.when(roleServiceSpy.hasRole).calledWith('groups').thenReturn(false);

      initComponent();
      respondToHashlistRequest(mockHashlistResponse());
      await vi.advanceTimersByTimeAsync(0);

      expect(gsSpy.ghelper).not.toHaveBeenCalled();
      expect(component.selectAccessgroup).toEqual([]);
    });
  });

  describe('onSubmit', () => {
    it('should update hashlist and navigate on valid form submission', async () => {
      initComponent();
      respondToHashlistRequest(mockHashlistResponse());
      await vi.advanceTimersByTimeAsync(0);

      component.updateForm.get('updateData.name')?.setValue('Updated Name');
      gsSpy.update.mockReturnValue(of({}));

      component.onSubmit();
      await vi.advanceTimersByTimeAsync(0);

      expect(gsSpy.update).toHaveBeenCalledWith(SERV.HASHLISTS, 1, expect.objectContaining({ name: 'Updated Name' }));
      expect(alertSpy.showSuccessMessage).toHaveBeenCalledWith('Hashlist saved');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/hashlists/hashlist']);
    });

    it('should navigate to /hashlists/superhashlist when type is 3', async () => {
      initComponent();
      respondToHashlistRequest(mockSuperHashlistResponse());
      await vi.advanceTimersByTimeAsync(0);

      component.updateForm.get('updateData.name')?.setValue('Updated Name');
      gsSpy.update.mockReturnValue(of({}));

      component.onSubmit();
      await vi.advanceTimersByTimeAsync(0);

      expect(gsSpy.update).toHaveBeenCalledWith(SERV.HASHLISTS, 1, expect.objectContaining({ name: 'Updated Name' }));
      expect(alertSpy.showSuccessMessage).toHaveBeenCalledWith('Hashlist saved');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/hashlists/superhashlist']);
    });

    it('should mark all fields as touched on invalid form', () => {
      initComponent();
      respondToHashlistRequest(mockHashlistResponse());

      const markAllAsTouchedSpy = vi.spyOn(component.updateForm, 'markAllAsTouched').mockReturnValue(undefined);
      const updateValueAndValiditySpy = vi
        .spyOn(component.updateForm, 'updateValueAndValidity')
        .mockReturnValue(undefined);

      component.updateForm.get('updateData.name')?.setValue('');
      component.updateForm.markAsUntouched();
      component.onSubmit();

      expect(markAllAsTouchedSpy).toHaveBeenCalled();
      expect(updateValueAndValiditySpy).toHaveBeenCalled();
      expect(gsSpy.update).not.toHaveBeenCalled();
    });
  });

  describe('importCrackedHashes', () => {
    it('should navigate to import cracked hashes page', () => {
      initComponent();
      respondToHashlistRequest(mockHashlistResponse());
      component.editedHashlistIndex = 42;

      component.importCrackedHashes();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/hashlists/hashlist/42/import-cracked-hashes']);
    });
  });

  describe('exportLeftHashes', () => {
    it('should call chelper and show success message', async () => {
      initComponent();
      respondToHashlistRequest(mockHashlistResponse());
      component.editedHashlistIndex = 42;
      gsSpy.chelper.mockReturnValue(of({}));

      component.exportLeftHashes();
      await vi.advanceTimersByTimeAsync(0);

      expect(gsSpy.chelper).toHaveBeenCalledWith(SERV.HELPER, 'exportLeftHashes', { hashlistId: 42 });
      expect(alertSpy.showSuccessMessage).toHaveBeenCalledWith('Exported Left Hashes');
    });
  });

  describe('exortPreCrackedHashes', () => {
    it('should call chelper and show success message', async () => {
      initComponent();
      respondToHashlistRequest(mockHashlistResponse());
      component.editedHashlistIndex = 42;
      gsSpy.chelper.mockReturnValue(of({}));

      component.exortPreCrackedHashes();
      await vi.advanceTimersByTimeAsync(0);

      expect(gsSpy.chelper).toHaveBeenCalledWith(SERV.HELPER, 'exportCrackedHashes', { hashlistId: 42 });
      expect(alertSpy.showSuccessMessage).toHaveBeenCalledWith('Cracked hashes from hashlist exported');
    });
  });

  describe('exportWordlist', () => {
    it('should call chelper and show success message', async () => {
      initComponent();
      respondToHashlistRequest(mockHashlistResponse());
      component.editedHashlistIndex = 42;
      gsSpy.chelper.mockReturnValue(of({}));

      component.exportWordlist();
      await vi.advanceTimersByTimeAsync(0);

      expect(gsSpy.chelper).toHaveBeenCalledWith(SERV.HELPER, 'exportWordlist', { hashlistId: 42 });
      expect(alertSpy.showSuccessMessage).toHaveBeenCalledWith('Exported Wordlist');
    });
  });

  describe('goToHashes', () => {
    it('should link the Hashes, Cracked and Remaining fields to the hashes page', async () => {
      // Suppress the role-gated tasks table and report-builder panel so the form
      // renders without their extra data requests; the link fields are not gated.
      roleServiceSpy.hasRole.mockReturnValue(false);
      // RouterLink computes an href via the mocked Router; give serializeUrl a
      // string so MockLocationStrategy doesn't choke while rendering the anchors.
      routerSpy.serializeUrl.mockReturnValue('/');
      initComponent();
      respondToHashlistRequest(mockHashlistResponse());
      component.editedHashlistIndex = 42;
      await vi.advanceTimersByTimeAsync(0);
      fixture.detectChanges();

      const linkByTitle = new Map(
        fixture.debugElement
          .queryAll(By.directive(InputTextComponent))
          .map((de) => de.componentInstance as InputTextComponent)
          .filter((input) => ['Hashes', 'Cracked', 'Remaining'].includes(input.title))
          .map((input) => [input.title, input.linkTo])
      );

      expect([...linkByTitle.keys()]).toEqual(['Hashes', 'Cracked', 'Remaining']);
      // Hashes links to the unfiltered list; Cracked/Remaining pack the filter into
      // the :id segment (split on '?' in hashes.component.ts) for cracked/uncracked views.
      expect(linkByTitle.get('Hashes')).toEqual(['/hashlists', 'hashes', 'hashlists', 42]);
      expect(linkByTitle.get('Cracked')).toEqual(['/hashlists', 'hashes', 'hashlists', '42?cracked']);
      expect(linkByTitle.get('Remaining')).toEqual(['/hashlists', 'hashes', 'hashlists', '42?uncracked']);
    });
  });

  describe('canDeactivate', () => {
    it('should return true when form is not dirty', () => {
      initComponent();
      respondToHashlistRequest(mockHashlistResponse());

      const result = component.canDeactivate();

      expect(result).toBe(true);
      expect(unsavedChangesSpy.setUnsavedChanges).not.toHaveBeenCalled();
    });

    it('should return false and set unsaved changes when form is dirty', async () => {
      initComponent();
      respondToHashlistRequest(mockHashlistResponse());
      await vi.advanceTimersByTimeAsync(0);

      component.updateForm.get('updateData.name')?.setValue('Changed');
      component.updateForm.markAsDirty();

      const result = component.canDeactivate();

      expect(result).toBe(false);
      expect(unsavedChangesSpy.setUnsavedChanges).toHaveBeenCalledWith(true);
    });
  });
});
