import { asyncScheduler, observeOn, of, throwError } from 'rxjs';
import type { MockedObject } from 'vitest';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { By } from '@angular/platform-browser';

import { AuthService } from '@services/access/auth.service';
import { ConfigService } from '@services/shared/config.service';

import { AuthComponent } from '@src/app/auth/auth.component';
import { ButtonsModule } from '@src/app/shared/buttons/buttons.module';
import { ComponentsModule } from '@src/app/shared/components.module';
import { InputModule } from '@src/app/shared/input/input.module';

describe('AuthComponent', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;

  // Mocks
  let mockAuthService: MockedObject<AuthService>;
  let mockConfigService: MockedObject<ConfigService>;

  beforeEach(async () => {
    mockAuthService = {
      logIn: vi.fn().mockName('AuthService.logIn')
    } as MockedObject<AuthService>;
    mockConfigService = {
      getEndpoint: vi.fn().mockName('ConfigService.getEndpoint')
    } as MockedObject<ConfigService>;

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
    expect(component.loginForm.controls.username).toBeTruthy();
    expect(component.loginForm.controls.password).toBeTruthy();
  });

  it('should mark form invalid if empty', () => {
    component.loginForm.setValue({ username: '', password: '' });
    expect(component.loginForm.invalid).toBe(true);
  });

  it('should call authService.logIn on valid form submission via button click', async () => {
    const fakeResponse = of(void 0).pipe(observeOn(asyncScheduler));
    mockAuthService.logIn.mockReturnValue(fakeResponse);
    component.loginForm.setValue({ username: 'user', password: 'pass' });

    const submitButtonDebugEl = fixture.debugElement.query(By.css('button-submit button'));
    submitButtonDebugEl.nativeElement.click();

    expect(component.isLoading).toBe(true);
    expect(mockAuthService.logIn).toHaveBeenCalledWith('user', 'pass');

    await vi.advanceTimersByTimeAsync(0);

    expect(component.isLoading).toBe(false);
    expect(component.loginForm.value.username).toBeNull();
    expect(component.loginForm.value.password).toBeNull();
  });

  it('should stop loading when login fails on submit button click', async () => {
    const errorResponse = throwError(() => new Error('Login failed')).pipe(observeOn(asyncScheduler));
    mockAuthService.logIn.mockReturnValue(errorResponse);

    component.loginForm.setValue({ username: 'user', password: 'wrong' });

    const submitButtonDebugEl = fixture.debugElement.query(By.css('button-submit button'));
    submitButtonDebugEl.nativeElement.click();

    expect(component.isLoading).toBe(true);
    expect(mockAuthService.logIn).toHaveBeenCalledWith('user', 'wrong');

    await vi.advanceTimersByTimeAsync(0);

    expect(component.isLoading).toBe(false);
  });

  it('should stop loading when login fails without a specific error message', async () => {
    const errorResponse = throwError(() => ({})).pipe(observeOn(asyncScheduler));
    mockAuthService.logIn.mockReturnValue(errorResponse);

    component.loginForm.setValue({ username: 'user', password: 'wrong' });

    const submitButtonDebugEl = fixture.debugElement.query(By.css('button-submit button'));
    submitButtonDebugEl.nativeElement.click();

    expect(component.isLoading).toBe(true);
    expect(mockAuthService.logIn).toHaveBeenCalledWith('user', 'wrong');

    await vi.advanceTimersByTimeAsync(0);

    expect(component.isLoading).toBe(false);
  });
});
