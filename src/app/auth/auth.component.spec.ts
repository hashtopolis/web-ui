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

import { AuthService } from '@services/access/auth.service';
import { AlertService } from '@services/shared/alert.service';
import { ConfigService } from '@services/shared/config.service';
import { UnsubscribeService } from '@services/unsubscribe.service';

import { AuthComponent } from '@src/app/auth/auth.component';
import { ButtonsModule } from '@src/app/shared/buttons/buttons.module';
import { ComponentsModule } from '@src/app/shared/components.module';
import { InputModule } from '@src/app/shared/input/input.module';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;

  // Mocks
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockAlertService: jasmine.SpyObj<AlertService>;
  let mockUnsubscribeService: jasmine.SpyObj<UnsubscribeService>;
  let mockConfigService: jasmine.SpyObj<ConfigService>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['logIn']);
    mockAlertService = jasmine.createSpyObj('AlertService', ['showErrorMessage']);
    mockUnsubscribeService = jasmine.createSpyObj('UnsubscribeService', ['add', 'unsubscribeAll']);
    mockConfigService = jasmine.createSpyObj('ConfigService', ['getEndpoint']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        InputModule,
        ButtonsModule,
        ComponentsModule,
        MatProgressSpinnerModule
      ],
      declarations: [AuthComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: AlertService, useValue: mockAlertService },
        { provide: UnsubscribeService, useValue: mockUnsubscribeService },
        { provide: ConfigService, useValue: mockConfigService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component and initialize form', () => {
    expect(component).toBeTruthy();
    expect(component.loginForm).toBeTruthy();
    expect(component.loginForm.controls['username']).toBeTruthy();
    expect(component.loginForm.controls['password']).toBeTruthy();
  });

  it('should mark form invalid if empty', () => {
    component.loginForm.setValue({ username: '', password: '' });
    expect(component.loginForm.invalid).toBeTrue();
  });

  it('should call authService.logIn on valid form submission via button click', fakeAsync(() => {
    const fakeResponse = of({}).pipe(observeOn(asyncScheduler));
    mockAuthService.logIn.and.returnValue(fakeResponse);
    component.loginForm.setValue({ username: 'user', password: 'pass' });

    const submitButtonDebugEl = fixture.debugElement.query(By.css('button-submit button'));
    submitButtonDebugEl.nativeElement.click();

    expect(component.isLoading).toBeTrue();
    expect(mockAuthService.logIn).toHaveBeenCalledWith('user', 'pass');

    tick();

    expect(component.isLoading).toBeFalse();
    expect(component.loginForm.value.username).toBeNull();
    expect(component.loginForm.value.password).toBeNull();
    expect(mockUnsubscribeService.add).toHaveBeenCalled();
  }));

  it('should show error message when login fails on submit button click', fakeAsync(() => {
    const errorResponse = throwError(() => new Error('Login failed')).pipe(observeOn(asyncScheduler));
    mockAuthService.logIn.and.returnValue(errorResponse);

    component.loginForm.setValue({ username: 'user', password: 'wrong' });

    const submitButtonDebugEl = fixture.debugElement.query(By.css('button-submit button'));
    submitButtonDebugEl.nativeElement.click();

    expect(component.isLoading).toBeTrue();
    expect(mockAuthService.logIn).toHaveBeenCalledWith('user', 'wrong');

    tick();

    expect(component.isLoading).toBeFalse();
    expect(mockAlertService.showErrorMessage).toHaveBeenCalledWith('Login failed');
  }));

  it('should show default error message when login fails without specific error message', fakeAsync(() => {
    const errorResponse = throwError(() => ({})).pipe(observeOn(asyncScheduler));
    mockAuthService.logIn.and.returnValue(errorResponse);

    component.loginForm.setValue({ username: 'user', password: 'wrong' });

    const submitButtonDebugEl = fixture.debugElement.query(By.css('button-submit button'));
    submitButtonDebugEl.nativeElement.click();

    expect(component.isLoading).toBeTrue();
    expect(mockAuthService.logIn).toHaveBeenCalledWith('user', 'wrong');

    tick();

    expect(component.isLoading).toBeFalse();
    expect(mockAlertService.showErrorMessage).toHaveBeenCalledWith('An error occurred. Please try again later.');
  }));

  it('should call unsubscribeAll on destroy', () => {
    component.ngOnDestroy();
    expect(mockUnsubscribeService.unsubscribeAll).toHaveBeenCalled();
  });
});
