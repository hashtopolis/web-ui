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
import { Perm } from '@src/app/core/_constants/userpermissions.config';
import { startOfDay, startOfNextDay, unixTimestampFromDate } from '@src/app/shared/utils/datetime';
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
    component.form.controls.scopes.setValue([Perm.JwtApiKey.READ]);
    mockGlobalService.create.and.returnValue(of(mockResponse()));

    await component.onSubmit();

    expect(mockGlobalService.create).toHaveBeenCalledWith(SERV.API_TOKENS, jasmine.objectContaining({ userId: 42 }));
    expect(mockStore.set).toHaveBeenCalledWith('jwt-xyz');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/account/api-keys']);
    expect(mockAlert.showSuccessMessage).toHaveBeenCalled();
  });

  it('sends endValid as the exclusive next-day-midnight cutoff (not end-of-picked-day)', async () => {
    component.form.controls.scopes.setValue([Perm.JwtApiKey.READ]);
    mockGlobalService.create.and.returnValue(of(mockResponse()));

    const pickedFrom = new Date(2026, 4, 10, 0, 0, 0, 0); // 2026-05-10 local
    const pickedUntil = new Date(2026, 4, 15, 0, 0, 0, 0); // 2026-05-15 local
    component.form.controls.validFrom.setValue(pickedFrom);
    component.form.controls.validUntil.setValue(pickedUntil);

    await component.onSubmit();

    const expectedEndValid = unixTimestampFromDate(startOfNextDay(pickedUntil));
    expect(mockGlobalService.create).toHaveBeenCalledWith(
      SERV.API_TOKENS,
      jasmine.objectContaining({ endValid: expectedEndValid })
    );
  });

  it('sends startValid as start-of-day of the picked validFrom', async () => {
    component.form.controls.scopes.setValue([Perm.JwtApiKey.READ]);
    mockGlobalService.create.and.returnValue(of(mockResponse()));

    const pickedFrom = new Date(2026, 4, 1, 9, 30); // 2026-05-01 09:30 local
    const pickedUntil = new Date(2026, 4, 15, 0, 0, 0, 0); // 2026-05-15 local
    component.form.controls.validFrom.setValue(pickedFrom);
    component.form.controls.validUntil.setValue(pickedUntil);

    await component.onSubmit();

    const expectedStartValid = unixTimestampFromDate(startOfDay(pickedFrom));
    expect(mockGlobalService.create).toHaveBeenCalledWith(
      SERV.API_TOKENS,
      jasmine.objectContaining({ startValid: expectedStartValid })
    );
  });

  it('shows an error and navigates without storing when the response has no token', async () => {
    component.form.controls.scopes.setValue([Perm.JwtApiKey.READ]);
    mockGlobalService.create.and.returnValue(of(mockResponse()));
    deserializeSpy.and.returnValue({ ...createdToken, token: undefined });

    await component.onSubmit();

    expect(mockStore.set).not.toHaveBeenCalled();
    expect(mockAlert.showErrorMessage).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/account/api-keys']);
  });

  it('shows an error when validFrom is missing even if the form-invalid guard is bypassed', async () => {
    // Validators.required normally keeps the form invalid when validFrom is null, so
    // onSubmit() would short-circuit at the first guard. This test exercises the
    // defensive backstop just below it by forcing form.invalid to false.
    component.form.controls.scopes.setValue([Perm.JwtApiKey.READ]);
    component.form.controls.validFrom.setValue(null);
    spyOnProperty(component.form, 'invalid', 'get').and.returnValue(false);

    await component.onSubmit();

    expect(mockGlobalService.create).not.toHaveBeenCalled();
    expect(mockAlert.showErrorMessage).toHaveBeenCalled();
  });

  it('shows an error and does not navigate when the POST fails', async () => {
    component.form.controls.scopes.setValue([Perm.JwtApiKey.READ]);
    mockGlobalService.create.and.returnValue(throwError(() => new Error('boom')));

    await component.onSubmit();

    expect(mockStore.set).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
    expect(mockAlert.showErrorMessage).toHaveBeenCalled();
  });

  describe('validityDays getter', () => {
    // The mat-datepicker emits picked dates at 00:00:00 local time, so the
    // getter must normalise to whole-day boundaries to report an inclusive
    // day count regardless of what time the form value carries.

    it('counts a three-day range inclusively when the picker emits midnight values', () => {
      component.form.controls.validFrom.setValue(new Date(2026, 4, 11, 0, 0, 0, 0));
      component.form.controls.validUntil.setValue(new Date(2026, 4, 13, 0, 0, 0, 0));

      expect(component.validityDays).toBe(3);
    });

    it('counts a same-day pick as one day', () => {
      const sameDay = new Date(2026, 4, 11, 0, 0, 0, 0);
      component.form.controls.validFrom.setValue(sameDay);
      component.form.controls.validUntil.setValue(sameDay);

      expect(component.validityDays).toBe(1);
    });

    it('returns null when validFrom is missing', () => {
      component.form.controls.validFrom.setValue(null);
      component.form.controls.validUntil.setValue(new Date(2026, 4, 13, 0, 0, 0, 0));

      expect(component.validityDays).toBeNull();
    });

    it('returns null when validUntil is before validFrom', () => {
      component.form.controls.validFrom.setValue(new Date(2026, 4, 13, 0, 0, 0, 0));
      component.form.controls.validUntil.setValue(new Date(2026, 4, 11, 0, 0, 0, 0));

      expect(component.validityDays).toBeNull();
    });
  });

  describe('validity range validator', () => {
    it('accepts same-day picks at midnight', () => {
      const sameDay = new Date(2026, 4, 11, 0, 0, 0, 0);
      component.form.controls.validFrom.setValue(sameDay);
      component.form.controls.validUntil.setValue(sameDay);

      expect(component.form.errors?.['validityRange']).toBeFalsy();
    });

    it('accepts validUntil strictly after validFrom', () => {
      component.form.controls.validFrom.setValue(new Date(2026, 4, 11, 0, 0, 0, 0));
      component.form.controls.validUntil.setValue(new Date(2026, 4, 13, 0, 0, 0, 0));

      expect(component.form.errors?.['validityRange']).toBeFalsy();
    });

    it('rejects validUntil strictly before validFrom', () => {
      component.form.controls.validFrom.setValue(new Date(2026, 4, 13, 0, 0, 0, 0));
      component.form.controls.validUntil.setValue(new Date(2026, 4, 11, 0, 0, 0, 0));

      expect(component.form.errors?.['validityRange']).toBeTrue();
    });
  });
});
