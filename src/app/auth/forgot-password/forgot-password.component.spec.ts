import { asyncScheduler, observeOn, of, throwError } from 'rxjs';

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';
import { UnsubscribeService } from '@services/unsubscribe.service';

import { ForgotPasswordComponent } from '@src/app/auth/forgot-password/forgot-password.component';
import { ButtonsModule } from '@src/app/shared/buttons/buttons.module';
import { ComponentsModule } from '@src/app/shared/components.module';
import { InputModule } from '@src/app/shared/input/input.module';
import { mockResponse } from '@src/app/testing/mock-response';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;

  // Mocks
  let mockGlobalService: jasmine.SpyObj<GlobalService>;
  let mockAlertService: jasmine.SpyObj<AlertService>;
  let mockUnsubscribeService: jasmine.SpyObj<UnsubscribeService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockGlobalService = jasmine.createSpyObj('GlobalService', ['chelper']);
    mockAlertService = jasmine.createSpyObj('AlertService', ['showSuccessMessage', 'showErrorMessage']);
    mockUnsubscribeService = jasmine.createSpyObj('UnsubscribeService', ['add', 'unsubscribeAll']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        InputModule,
        ButtonsModule,
        ComponentsModule
      ],
      declarations: [ForgotPasswordComponent],
      providers: [
        { provide: GlobalService, useValue: mockGlobalService },
        { provide: AlertService, useValue: mockAlertService },
        { provide: UnsubscribeService, useValue: mockUnsubscribeService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component and initialize the form', () => {
    expect(component).toBeTruthy();
    expect(component.forgotForm).toBeTruthy();
    expect(component.forgotForm.controls.username).toBeTruthy();
    expect(component.forgotForm.controls.email).toBeTruthy();
  });

  it('should mark the form invalid when both fields are empty', () => {
    component.forgotForm.setValue({ username: '', email: '' });
    expect(component.forgotForm.invalid).toBeTrue();
  });

  it('should reject emails without a top-level domain, matching the backend rule', () => {
    const email = component.forgotForm.controls.email;

    email.setValue('a@b');
    expect(email.hasError('email')).toBeTrue();

    email.setValue('user@localhost');
    expect(email.hasError('email')).toBeTrue();

    email.setValue('user@example.com');
    expect(email.valid).toBeTrue();
  });

  it('should not send a request when the form is invalid', () => {
    component.forgotForm.setValue({ username: '', email: 'not-an-email' });

    component.onSubmit();

    expect(mockGlobalService.chelper).not.toHaveBeenCalled();
    expect(component.forgotForm.touched).toBeTrue();
  });

  it('should request a password reset and redirect to login on valid submit', fakeAsync(() => {
    mockGlobalService.chelper.and.returnValue(of(mockResponse()).pipe(observeOn(asyncScheduler)));
    component.forgotForm.setValue({ username: 'admin', email: 'admin@example.com' });

    const submitButtonDebugEl = fixture.debugElement.query(By.css('button-submit button'));
    submitButtonDebugEl.nativeElement.click();

    expect(component.isLoading).toBeTrue();
    expect(mockGlobalService.chelper).toHaveBeenCalledWith(SERV.HELPER, 'resetUserPassword', {
      username: 'admin',
      email: 'admin@example.com'
    });

    tick();

    expect(component.isLoading).toBeFalse();
    expect(mockAlertService.showSuccessMessage).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth']);
    expect(mockUnsubscribeService.add).toHaveBeenCalled();
  }));

  it('should reset the loading state and not redirect when the request fails', fakeAsync(() => {
    mockGlobalService.chelper.and.returnValue(throwError(() => new Error('failed')).pipe(observeOn(asyncScheduler)));
    component.forgotForm.setValue({ username: 'admin', email: 'admin@example.com' });

    component.onSubmit();
    expect(component.isLoading).toBeTrue();

    tick();

    expect(component.isLoading).toBeFalse();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  }));

  it('should unsubscribe from all subscriptions on destroy', () => {
    component.ngOnDestroy();
    expect(mockUnsubscribeService.unsubscribeAll).toHaveBeenCalled();
  });
});
