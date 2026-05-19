import { of, throwError } from 'rxjs';

import { HttpErrorResponse } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { JApiToken, computeApiTokenStatus } from '@models/api-token.model';
import { UIConfig, uiConfigDefault } from '@models/config-ui.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

import { ApiKeyDetailComponent } from '@src/app/account/api-keys/api-key-detail/api-key-detail.component';
import { UISettingsUtilityClass } from '@src/app/shared/utils/config';
import { mockResponse } from '@src/app/testing/mock-response';

describe('ApiKeyDetailComponent', () => {
  let component: ApiKeyDetailComponent;
  let fixture: ComponentFixture<ApiKeyDetailComponent>;

  let mockGlobalService: jasmine.SpyObj<GlobalService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAlert: jasmine.SpyObj<AlertService>;
  let mockTitle: jasmine.SpyObj<AutoTitleService>;
  let mockStorage: jasmine.SpyObj<LocalStorageService<UIConfig>>;
  let mockRoute: { snapshot: { params: Record<string, string> } };

  /** Token returned by the (stubbed) deserializer for the happy path. */
  const loadedToken: JApiToken = {
    id: 7,
    type: 'apiToken',
    startValid: 1_700_000_000,
    endValid: 1_700_086_400,
    userId: 42,
    isRevoked: false
  };

  /** Build the fixture after wiring the route id, since route params are read in ngOnInit. */
  function createFixture(routeId: string): void {
    mockRoute.snapshot.params['id'] = routeId;
    fixture = TestBed.createComponent(ApiKeyDetailComponent);
    component = fixture.componentInstance;
  }

  beforeEach(async () => {
    mockGlobalService = jasmine.createSpyObj('GlobalService', ['get']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockRouter.navigate.and.resolveTo(true);
    mockAlert = jasmine.createSpyObj('AlertService', ['showSuccessMessage', 'showErrorMessage']);
    mockTitle = jasmine.createSpyObj('AutoTitleService', ['set']);
    mockStorage = jasmine.createSpyObj('LocalStorageService', ['getItem', 'setItem', 'removeItem']);
    mockStorage.getItem.and.returnValue(uiConfigDefault);
    mockRoute = { snapshot: { params: {} } };

    spyOn(JsonAPISerializer.prototype, 'deserialize').and.returnValue(loadedToken);
    spyOn(UISettingsUtilityClass.prototype, 'getSetting').and.returnValue(undefined);

    await TestBed.configureTestingModule({
      declarations: [ApiKeyDetailComponent],
      providers: [
        { provide: GlobalService, useValue: mockGlobalService },
        { provide: Router, useValue: mockRouter },
        { provide: AlertService, useValue: mockAlert },
        { provide: AutoTitleService, useValue: mockTitle },
        { provide: LocalStorageService, useValue: mockStorage },
        { provide: ActivatedRoute, useValue: mockRoute }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  it('loads the token and computes status on a valid route id', async () => {
    mockGlobalService.get.and.returnValue(of(mockResponse()));
    createFixture('7');

    fixture.detectChanges();
    // Two drains: loadToken awaits firstValueFrom, then synchronously continues — the
    // second whenStable() ensures any chained microtasks settle before assertions.
    await fixture.whenStable();
    await fixture.whenStable();

    expect(mockGlobalService.get).toHaveBeenCalled();
    expect(component.token).toEqual(loadedToken);
    expect(component.status).toBe(computeApiTokenStatus(loadedToken));
    expect(component.loading).toBe(false);
    expect(component.notFound).toBe(false);
    expect(component.loadError).toBe(false);
  });

  it('marks notFound when the route id is not numeric and skips the HTTP call', () => {
    createFixture('abc');

    fixture.detectChanges();

    expect(mockGlobalService.get).not.toHaveBeenCalled();
    expect(component.notFound).toBe(true);
    expect(component.loading).toBe(false);
  });

  it('marks notFound on a 404 and shows the not-found alert', async () => {
    mockGlobalService.get.and.returnValue(throwError(() => new HttpErrorResponse({ status: 404 })));
    createFixture('7');

    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenStable();

    expect(component.notFound).toBe(true);
    expect(component.loadError).toBe(false);
    expect(component.loading).toBe(false);
    expect(mockAlert.showErrorMessage).toHaveBeenCalledWith('Could not load API key.');
  });

  it('marks loadError on a non-404 error and shows the generic alert', async () => {
    mockGlobalService.get.and.returnValue(throwError(() => new HttpErrorResponse({ status: 500 })));
    createFixture('7');

    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenStable();

    expect(component.notFound).toBe(false);
    expect(component.loadError).toBe(true);
    expect(component.loading).toBe(false);
    expect(mockAlert.showErrorMessage).toHaveBeenCalledWith('Could not load API key — please try again later.');
  });

  it('formatExpiry returns the same string as formatTimestamp for one second earlier', () => {
    createFixture('7');
    // No detectChanges: we only test the pure formatters, which read dateFormat from
    // the field initializer (uiConfigDefault.timefmt) and don't require ngOnInit.

    const endValidSec = 1_700_086_400;
    expect(component.formatExpiry(endValidSec)).toBe(component.formatTimestamp(endValidSec - 1));
  });
});
