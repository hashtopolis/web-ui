import { of, throwError } from 'rxjs';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { JApiToken } from '@models/api-token.model';
import { Permission } from '@models/global-permission-group.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { ApiKeyRevealStore } from '@services/api-key-reveal.store';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { PermissionService } from '@services/permission/permission.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

import { NewApiKeyComponent } from '@src/app/account/api-keys/new-api-key/new-api-key.component';
import { mockResponse } from '@src/app/testing/mock-response';

describe('NewApiKeyComponent', () => {
  let component: NewApiKeyComponent;
  let fixture: ComponentFixture<NewApiKeyComponent>;

  let mockGlobalService: jasmine.SpyObj<GlobalService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAlert: jasmine.SpyObj<AlertService>;
  let mockPermission: jasmine.SpyObj<PermissionService>;
  let mockStore: jasmine.SpyObj<ApiKeyRevealStore>;
  let mockTitle: jasmine.SpyObj<AutoTitleService>;
  let deserializeSpy: jasmine.Spy;

  /** Token shape returned by the (stubbed) deserializer for the happy path. */
  const createdToken: JApiToken = {
    id: 1,
    type: 'apiToken',
    startValid: 0,
    endValid: 1_000,
    userId: 42,
    isRevoked: false,
    token: 'jwt-xyz'
  };

  beforeEach(async () => {
    mockGlobalService = jasmine.createSpyObj('GlobalService', ['create']);
    Object.defineProperty(mockGlobalService, 'userId', { value: 42, configurable: true });
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockRouter.navigate.and.resolveTo(true);
    mockAlert = jasmine.createSpyObj('AlertService', ['showSuccessMessage', 'showErrorMessage']);
    mockPermission = jasmine.createSpyObj('PermissionService', ['loadPermissions']);
    mockPermission.loadPermissions.and.returnValue(of<Permission>({ permJwtApiKeyRead: true }));
    mockStore = jasmine.createSpyObj('ApiKeyRevealStore', ['set', 'consume']);
    mockTitle = jasmine.createSpyObj('AutoTitleService', ['set']);

    deserializeSpy = spyOn(JsonAPISerializer.prototype, 'deserialize').and.returnValue(createdToken);

    await TestBed.configureTestingModule({
      declarations: [NewApiKeyComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: GlobalService, useValue: mockGlobalService },
        { provide: Router, useValue: mockRouter },
        { provide: AlertService, useValue: mockAlert },
        { provide: PermissionService, useValue: mockPermission },
        { provide: ApiKeyRevealStore, useValue: mockStore },
        { provide: AutoTitleService, useValue: mockTitle }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(NewApiKeyComponent);
    component = fixture.componentInstance;
  });

  // We intentionally do not call fixture.detectChanges(): the template binds form
  // controls to date-picker accessors that aren't declared in this lightweight
  // module. The form itself is built in the component's field initializer, so
  // `component.form` is already populated and we can drive onSubmit() directly.

  it('does not call create() when the form is invalid', async () => {
    // Form starts with empty scopes (Validators.required → invalid).
    await component.onSubmit();

    expect(mockGlobalService.create).not.toHaveBeenCalled();
    expect(mockStore.set).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('stores the freshly minted token and navigates to the list on success', async () => {
    component.form.controls.scopes.setValue(['permJwtApiKeyRead']);
    mockGlobalService.create.and.returnValue(of(mockResponse()));

    await component.onSubmit();

    expect(mockGlobalService.create).toHaveBeenCalledWith(SERV.API_TOKENS, jasmine.objectContaining({ userId: 42 }));
    expect(mockStore.set).toHaveBeenCalledWith('jwt-xyz');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/account/api-keys']);
    expect(mockAlert.showSuccessMessage).toHaveBeenCalled();
  });

  it('shows an error and navigates without storing when the response has no token', async () => {
    component.form.controls.scopes.setValue(['permJwtApiKeyRead']);
    mockGlobalService.create.and.returnValue(of(mockResponse()));
    deserializeSpy.and.returnValue({ ...createdToken, token: undefined });

    await component.onSubmit();

    expect(mockStore.set).not.toHaveBeenCalled();
    expect(mockAlert.showErrorMessage).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/account/api-keys']);
  });

  it('shows an error and does not navigate when the POST fails', async () => {
    component.form.controls.scopes.setValue(['permJwtApiKeyRead']);
    mockGlobalService.create.and.returnValue(throwError(() => new Error('boom')));

    await component.onSubmit();

    expect(mockStore.set).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
    expect(mockAlert.showErrorMessage).toHaveBeenCalled();
  });
});
