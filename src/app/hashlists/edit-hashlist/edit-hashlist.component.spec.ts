import { of } from 'rxjs';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute, Router } from '@angular/router';

import { ResponseWrapper } from '@models/response.model';

import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { HashListRoleService } from '@services/roles/hashlists/hashlist-role.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';
import { ConfigService } from '@services/shared/config.service';
import { UnsavedChangesService } from '@services/shared/unsaved-changes.service';
import { UnsubscribeService } from '@services/unsubscribe.service';

import { StaticArrayPipe } from '@src/app/core/_pipes/static-array.pipe';
import { EditHashlistComponent } from '@src/app/hashlists/edit-hashlist/edit-hashlist.component';
import { ButtonsModule } from '@src/app/shared/buttons/buttons.module';
import { ComponentsModule } from '@src/app/shared/components.module';
import { InputModule } from '@src/app/shared/input/input.module';
import { PageSubTitleComponent } from '@src/app/shared/page-headers/page-subtitle/page-subtitle.component';
import { mockResponse } from '@src/app/testing/mock-response';

const mockHashlistResponse = (): ResponseWrapper =>
  mockResponse({
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
  mockResponse({
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

const mockAccessGroupsResponse: ResponseWrapper = mockResponse({
  data: [
    { id: 1, type: 'accessGroup', attributes: { groupName: 'Admin' } },
    { id: 2, type: 'accessGroup', attributes: { groupName: 'User' } }
  ]
}) as ResponseWrapper;

describe('EditHashlistComponent', () => {
  let component: EditHashlistComponent;
  let fixture: ComponentFixture<EditHashlistComponent>;
  let httpMock: HttpTestingController;

  let gsSpy: jasmine.SpyObj<GlobalService>;
  let alertSpy: jasmine.SpyObj<AlertService>;
  let titleSpy: jasmine.SpyObj<AutoTitleService>;
  let unsubSpy: jasmine.SpyObj<UnsubscribeService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let configSpy: jasmine.SpyObj<ConfigService>;
  let unsavedChangesSpy: jasmine.SpyObj<UnsavedChangesService>;
  let roleServiceSpy: jasmine.SpyObj<HashListRoleService>;

  beforeEach(async () => {
    gsSpy = jasmine.createSpyObj('GlobalService', ['get', 'ghelper', 'update', 'chelper']);
    Object.defineProperty(gsSpy, 'userId', { get: () => 1 });
    alertSpy = jasmine.createSpyObj('AlertService', ['showSuccessMessage', 'showErrorMessage']);
    titleSpy = jasmine.createSpyObj('AutoTitleService', ['set']);
    unsubSpy = jasmine.createSpyObj('UnsubscribeService', ['add', 'unsubscribeAll']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl']);
    configSpy = jasmine.createSpyObj('ConfigService', ['getEndpoint']);
    unsavedChangesSpy = jasmine.createSpyObj('UnsavedChangesService', ['setUnsavedChanges']);
    roleServiceSpy = jasmine.createSpyObj('HashListRoleService', ['hasRole']);

    configSpy.getEndpoint.and.returnValue('http://localhost:8080/api/v2');

    await TestBed.configureTestingModule({
      declarations: [EditHashlistComponent, PageSubTitleComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        InputModule,
        ButtonsModule,
        ComponentsModule,
        MatProgressBarModule,
        MatIconModule,
        MatExpansionModule
      ],
      providers: [
        StaticArrayPipe,
        { provide: GlobalService, useValue: gsSpy },
        { provide: AlertService, useValue: alertSpy },
        { provide: AutoTitleService, useValue: titleSpy },
        { provide: UnsubscribeService, useValue: unsubSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ConfigService, useValue: configSpy },
        { provide: UnsavedChangesService, useValue: unsavedChangesSpy },
        { provide: HashListRoleService, useValue: roleServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: { params: of({ id: '1' }) }
        }
      ]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  beforeEach(() => {
    roleServiceSpy.hasRole.and.returnValue(true);
    gsSpy.ghelper.and.returnValue(of(mockAccessGroupsResponse));
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

    it('should unsubscribe on destroy', () => {
      initComponent();
      respondToHashlistRequest(mockHashlistResponse());

      component.ngOnDestroy();

      expect(unsubSpy.unsubscribeAll).toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    it('should load hashlist and data successfully', fakeAsync(() => {
      initComponent();
      respondToHashlistRequest(mockHashlistResponse());
      tick();

      expect(component.isLoading).toBeFalse();
      expect(component.editedHashlist).toBeDefined();
      expect(component.hashtype).toBeDefined();
    }));

    it('should navigate to /forbidden on 403 error', fakeAsync(() => {
      initComponent();
      const req = httpMock.expectOne((request) => request.url.includes('/hashlists/'));
      req.flush('error', { status: 403, statusText: 'Forbidden' });
      tick();

      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/forbidden');
      expect(component.isLoading).toBeTrue();
    }));

    it('should navigate to /not-found on 404 error', fakeAsync(() => {
      initComponent();
      const req = httpMock.expectOne((request) => request.url.includes('/hashlists/'));
      req.flush('error', { status: 404, statusText: 'Not Found' });
      tick();

      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/not-found');
      expect(component.isLoading).toBeTrue();
    }));

    it('should show error message on 500+ error without redirect', fakeAsync(() => {
      fixture = TestBed.createComponent(EditHashlistComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      const allRequests = httpMock.match((req) => req.url.includes('/hashlists/'));
      allRequests[0].flush('error', { status: 500, statusText: 'Internal Server Error' });

      tick();

      const retryRequests = httpMock.match((req) => req.url.includes('/hashlists/'));
      retryRequests[0].flush('error', { status: 500, statusText: 'Internal Server Error' });

      tick();

      expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
      expect(alertSpy.showErrorMessage).toHaveBeenCalledWith(jasmine.stringContaining('Error loading hashlist'));
      expect(component.isLoading).toBeFalse();
    }));

    it('should show generic error message on non-HttpError error', fakeAsync(() => {
      initComponent();
      const req = httpMock.expectOne((request) => request.url.includes('/hashlists/'));
      req.error(new ProgressEvent('error'));
      tick();

      expect(alertSpy.showErrorMessage).toHaveBeenCalledWith('Error loading hashlist.');
      expect(component.isLoading).toBeFalse();
    }));

    it('should retry without includes on 500 error from loadHashlist', fakeAsync(() => {
      fixture = TestBed.createComponent(EditHashlistComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      const allRequests = httpMock.match((req) => req.url.includes('/hashlists/'));
      allRequests[0].flush('error', { status: 500, statusText: 'Internal Server Error' });

      tick();

      const retryRequests = httpMock.match((req) => req.url.includes('/hashlists/'));
      retryRequests[0].flush(mockHashlistResponse());

      tick();

      expect(component.editedHashlist).toBeDefined();
      expect(component.isLoading).toBeFalse();
    }));

    it('should throw non-500 errors from loadHashlist and handle in ngOnInit', fakeAsync(() => {
      initComponent();
      const req = httpMock.expectOne((request) => request.url.includes('/hashlists/'));
      req.flush('error', { status: 404, statusText: 'Not Found' });
      tick();

      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/not-found');
    }));
  });

  describe('loadData', () => {
    it('should load access groups when user has groups role', fakeAsync(() => {
      initComponent();
      respondToHashlistRequest(mockHashlistResponse());
      tick();

      expect(gsSpy.ghelper).toHaveBeenCalledWith(SERV.HELPER, 'getAccessGroups');
      expect(component.selectAccessgroup.length).toBe(2);
    }));

    it('should not load access groups when user lacks groups role', fakeAsync(() => {
      roleServiceSpy.hasRole.withArgs('groups').and.returnValue(false);

      initComponent();
      respondToHashlistRequest(mockHashlistResponse());
      tick();

      expect(gsSpy.ghelper).not.toHaveBeenCalled();
      expect(component.selectAccessgroup).toEqual([]);
    }));
  });

  describe('onSubmit', () => {
    it('should update hashlist and navigate on valid form submission', fakeAsync(() => {
      initComponent();
      respondToHashlistRequest(mockHashlistResponse());
      tick();

      component.updateForm.get('updateData.name')?.setValue('Updated Name');
      gsSpy.update.and.returnValue(of({}));

      component.onSubmit();
      tick();

      expect(gsSpy.update).toHaveBeenCalledWith(SERV.HASHLISTS, 1, jasmine.objectContaining({ name: 'Updated Name' }));
      expect(alertSpy.showSuccessMessage).toHaveBeenCalledWith('Hashlist saved');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/hashlists/hashlist']);
    }));

    it('should navigate to /hashlists/superhashlist when type is 3', fakeAsync(() => {
      initComponent();
      respondToHashlistRequest(mockSuperHashlistResponse());
      tick();

      component.updateForm.get('updateData.name')?.setValue('Updated Name');
      gsSpy.update.and.returnValue(of({}));

      component.onSubmit();
      tick();

      expect(gsSpy.update).toHaveBeenCalledWith(SERV.HASHLISTS, 1, jasmine.objectContaining({ name: 'Updated Name' }));
      expect(alertSpy.showSuccessMessage).toHaveBeenCalledWith('Hashlist saved');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/hashlists/superhashlist']);
    }));

    it('should mark all fields as touched on invalid form', () => {
      initComponent();
      respondToHashlistRequest(mockHashlistResponse());

      const markAllAsTouchedSpy = spyOn(component.updateForm, 'markAllAsTouched');
      const updateValueAndValiditySpy = spyOn(component.updateForm, 'updateValueAndValidity');

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
    it('should call chelper and show success message', fakeAsync(() => {
      initComponent();
      respondToHashlistRequest(mockHashlistResponse());
      component.editedHashlistIndex = 42;
      gsSpy.chelper.and.returnValue(of({}));

      component.exportLeftHashes();
      tick();

      expect(gsSpy.chelper).toHaveBeenCalledWith(SERV.HELPER, 'exportLeftHashes', { hashlistId: 42 });
      expect(alertSpy.showSuccessMessage).toHaveBeenCalledWith('Exported Left Hashes');
      expect(unsubSpy.add).toHaveBeenCalled();
    }));
  });

  describe('exortPreCrackedHashes', () => {
    it('should call chelper and show success message', fakeAsync(() => {
      initComponent();
      respondToHashlistRequest(mockHashlistResponse());
      component.editedHashlistIndex = 42;
      gsSpy.chelper.and.returnValue(of({}));

      component.exortPreCrackedHashes();
      tick();

      expect(gsSpy.chelper).toHaveBeenCalledWith(SERV.HELPER, 'exportCrackedHashes', { hashlistId: 42 });
      expect(alertSpy.showSuccessMessage).toHaveBeenCalledWith('Cracked hashes from hashlist exported');
      expect(unsubSpy.add).toHaveBeenCalled();
    }));
  });

  describe('exportWordlist', () => {
    it('should call chelper and show success message', fakeAsync(() => {
      initComponent();
      respondToHashlistRequest(mockHashlistResponse());
      component.editedHashlistIndex = 42;
      gsSpy.chelper.and.returnValue(of({}));

      component.exportWordlist();
      tick();

      expect(gsSpy.chelper).toHaveBeenCalledWith(SERV.HELPER, 'exportWordlist', { hashlistId: 42 });
      expect(alertSpy.showSuccessMessage).toHaveBeenCalledWith('Exported Wordlist');
      expect(unsubSpy.add).toHaveBeenCalled();
    }));
  });

  describe('goToHashes', () => {
    it('should navigate to hashes page', () => {
      initComponent();
      respondToHashlistRequest(mockHashlistResponse());
      component.editedHashlistIndex = 42;

      component.goToHashes();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/hashlists', 'hashes', 'hashlists', 42]);
    });
  });

  describe('canDeactivate', () => {
    it('should return true when form is not dirty', () => {
      initComponent();
      respondToHashlistRequest(mockHashlistResponse());

      const result = component.canDeactivate();

      expect(result).toBeTrue();
      expect(unsavedChangesSpy.setUnsavedChanges).not.toHaveBeenCalled();
    });

    it('should return false and set unsaved changes when form is dirty', fakeAsync(() => {
      initComponent();
      respondToHashlistRequest(mockHashlistResponse());
      tick();

      component.updateForm.get('updateData.name')?.setValue('Changed');
      component.updateForm.markAsDirty();

      const result = component.canDeactivate();

      expect(result).toBeFalse();
      expect(unsavedChangesSpy.setUnsavedChanges).toHaveBeenCalledWith(true);
    }));
  });
});
