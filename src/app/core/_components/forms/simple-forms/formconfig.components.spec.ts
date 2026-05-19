import { of, throwError } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ResponseWrapper } from '@models/response.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { MetadataService } from '@services/metadata.service';
import { NotificationsRoleService } from '@services/roles/config/notifications-role.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';
import { CookieService } from '@services/shared/cookies.service';
import { UIConfigService } from '@services/shared/storage.service';
import { UnsubscribeService } from '@services/unsubscribe.service';

import { FormConfigComponent } from '@src/app/core/_components/forms/simple-forms/formconfig.component';

describe('FormConfigComponent', () => {
  let component: FormConfigComponent;
  let fixture: ComponentFixture<FormConfigComponent>;
  let globalService: jasmine.SpyObj<GlobalService>;
  let alertService: jasmine.SpyObj<AlertService>;
  let uicService: jasmine.SpyObj<UIConfigService>;
  let notificationRoleService: jasmine.SpyObj<NotificationsRoleService>;
  let activatedRoute: Partial<ActivatedRoute>;

  beforeEach(async () => {
    const globalServiceSpy = jasmine.createSpyObj('GlobalService', ['getAll', 'update']);
    alertService = jasmine.createSpyObj('AlertService', ['showSuccessMessage', 'showErrorMessage']);
    const autoTitleServiceSpy = jasmine.createSpyObj('AutoTitleService', ['set']);
    uicService = jasmine.createSpyObj('UIConfigService', ['onUpdatingCheck']);
    notificationRoleService = jasmine.createSpyObj('NotificationsRoleService', ['hasRole']);
    const cookieServiceSpy = jasmine.createSpyObj('CookieService', ['getCookie']);
    cookieServiceSpy.getCookie.and.returnValue('0');

    activatedRoute = {
      data: of({
        kind: 'servergs',
        type: 'edit',
        serviceConfig: SERV.CONFIGS,
        breadcrumb: 'General Settings'
      })
    };

    await TestBed.configureTestingModule({
      declarations: [FormConfigComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: GlobalService, useValue: globalServiceSpy },
        { provide: AlertService, useValue: alertService },
        { provide: AutoTitleService, useValue: autoTitleServiceSpy },
        { provide: UIConfigService, useValue: uicService },
        { provide: CookieService, useValue: cookieServiceSpy },
        { provide: NotificationsRoleService, useValue: notificationRoleService },
        { provide: ActivatedRoute, useValue: activatedRoute },
        JsonAPISerializer,
        MetadataService,
        UnsubscribeService
      ]
    }).compileComponents();

    globalService = TestBed.inject(GlobalService) as jasmine.SpyObj<GlobalService>;
    globalService.getAll.and.returnValue(
      of({
        jsonapi: { version: '1.1' },
        links: { self: '/api/v2/ui/configs' },
        data: []
      } as unknown as ResponseWrapper)
    );

    fixture = TestBed.createComponent(FormConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should convert numeric string values to numbers for select fields', () => {
    // Mock API response with serverLogLevel = '30' (WARNING)
    const mockApiResponse = {
      jsonapi: { version: '1.1' },
      links: { self: '/api/v2/ui/configs' },
      data: [
        {
          type: 'config',
          id: 1,
          attributes: {
            configSectionId: 1,
            item: 'serverLogLevel',
            value: '30'
          }
        }
      ]
    } as unknown as ResponseWrapper;

    globalService.getAll.and.returnValue(of(mockApiResponse));

    component.formMetadata = [
      {
        name: 'serverLogLevel',
        label: 'Server Log Level',
        type: 'select',
        selectOptions: [
          { label: 'TRACE', value: 0 },
          { label: 'DEBUG', value: 10 },
          { label: 'INFO', value: 20 },
          { label: 'WARNING', value: 30 }
        ]
      }
    ];

    component.loadEdit();

    // Value should be converted to number 30, not string '30'
    expect(component.formValues['serverLogLevel'] as unknown).toBe(30);
    expect(typeof component.formValues['serverLogLevel']).toBe('number');
  });

  it('should convert numeric string values to numbers for agentStatTension select field', () => {
    // Mock API response with agentStatTension = '1' (Bezier curves)
    const mockApiResponse = {
      jsonapi: { version: '1.1' },
      links: { self: '/api/v2/ui/configs' },
      data: [
        {
          type: 'config',
          id: 2,
          attributes: {
            configSectionId: 1,
            item: 'agentStatTension',
            value: '1'
          }
        }
      ]
    } as unknown as ResponseWrapper;

    globalService.getAll.and.returnValue(of(mockApiResponse));

    component.formMetadata = [
      {
        name: 'agentStatTension',
        label: 'Agent Stat Tension',
        type: 'select',
        selectOptions: [
          { label: 'Straight lines', value: 0 },
          { label: 'Bezier curves', value: 1 }
        ]
      }
    ];

    component.loadEdit();

    // Value should be converted to number 1, not string '1'
    expect(component.formValues['agentStatTension'] as unknown).toBe(1);
    expect(typeof component.formValues['agentStatTension']).toBe('number');
  });

  it('should convert "1" and "0" to booleans only for checkbox fields', () => {
    // Mock API response with checkbox and select fields
    const mockApiResponse = {
      jsonapi: { version: '1.1' },
      links: { self: '/api/v2/ui/configs' },
      data: [
        {
          type: 'config',
          id: 3,
          attributes: {
            configSectionId: 1,
            item: 'hashcatBrainEnable',
            value: '1'
          }
        },
        {
          type: 'config',
          id: 4,
          attributes: {
            configSectionId: 1,
            item: 'agentStatTension',
            value: '0'
          }
        }
      ]
    } as unknown as ResponseWrapper;

    globalService.getAll.and.returnValue(of(mockApiResponse));

    component.formMetadata = [
      {
        name: 'hashcatBrainEnable',
        label: 'Enable Hashcat Brain',
        type: 'checkbox'
      },
      {
        name: 'agentStatTension',
        label: 'Agent Stat Tension',
        type: 'select',
        selectOptions: [
          { label: 'Straight lines', value: 0 },
          { label: 'Bezier curves', value: 1 }
        ]
      }
    ];

    component.loadEdit();

    // Checkbox should be true
    expect(component.formValues['hashcatBrainEnable']).toBe(true);
    expect(typeof component.formValues['hashcatBrainEnable']).toBe('boolean');

    // Select should be number 0, not false
    expect(component.formValues['agentStatTension'] as unknown).toBe(0);
    expect(typeof component.formValues['agentStatTension']).toBe('number');
  });

  it('should preserve string values that are not numeric', () => {
    // Mock API response with text field
    const mockApiResponse = {
      jsonapi: { version: '1.1' },
      links: { self: '/api/v2/ui/configs' },
      data: [
        {
          type: 'config',
          id: 5,
          attributes: {
            configSectionId: 1,
            item: 'timefmt',
            value: 'yyyy-MM-dd HH:mm:ss'
          }
        }
      ]
    } as unknown as ResponseWrapper;

    globalService.getAll.and.returnValue(of(mockApiResponse));

    component.formMetadata = [
      {
        name: 'timefmt',
        label: 'Time Format',
        type: 'text'
      }
    ];

    component.loadEdit();

    // Should remain as string
    expect(component.formValues['timefmt']).toBe('yyyy-MM-dd HH:mm:ss');
    expect(typeof component.formValues['timefmt']).toBe('string');
  });

  it('should set form ids and mark the form as loaded after loadEdit', () => {
    const mockApiResponse = {
      jsonapi: { version: '1.1' },
      links: { self: '/api/v2/ui/configs' },
      data: [
        {
          type: 'config',
          id: 11,
          attributes: {
            configSectionId: 1,
            item: 'hashcatBrainEnable',
            value: '1'
          }
        },
        {
          type: 'config',
          id: 12,
          attributes: {
            configSectionId: 1,
            item: 'timefmt',
            value: 'yyyy-MM-dd HH:mm:ss'
          }
        }
      ]
    } as unknown as ResponseWrapper;

    globalService.getAll.and.returnValue(of(mockApiResponse));

    component.loadEdit();

    expect(component.isloaded).toBeTrue();
    expect(component.formIds).toEqual({
      hashcatBrainEnable: 11,
      timefmt: 12
    });
    expect(component.formValues).toEqual({
      hashcatBrainEnable: true,
      timefmt: 'yyyy-MM-dd HH:mm:ss'
    });
  });

  it('should update only changed fields and notify on success', () => {
    component.title = 'General Settings';
    component.formValues = {
      serverLogLevel: 20 as unknown as string | boolean,
      hashcatBrainEnable: true
    } as unknown as typeof component.formValues;
    component.formIds = {
      serverLogLevel: 21,
      hashcatBrainEnable: 22
    };

    globalService.update.and.returnValue(of({} as object));

    component.onFormSubmit({
      serverLogLevel: 30,
      hashcatBrainEnable: false
    });

    expect(globalService.update).toHaveBeenCalledTimes(2);
    expect(globalService.update.calls.allArgs()).toEqual([
      [SERV.CONFIGS, 21, { item: 'serverLogLevel', value: '30' }],
      [SERV.CONFIGS, 22, { item: 'hashcatBrainEnable', value: '0' }]
    ]);
    expect(uicService.onUpdatingCheck).toHaveBeenCalledWith('serverLogLevel' as any);
    expect(uicService.onUpdatingCheck).toHaveBeenCalledWith('hashcatBrainEnable' as any);
    expect(alertService.showSuccessMessage).toHaveBeenCalledWith('Saved General Settings');
  });

  it('should do nothing when form values have not changed', () => {
    component.formValues = {
      serverLogLevel: 20 as unknown as string | boolean,
      hashcatBrainEnable: true
    } as unknown as typeof component.formValues;
    component.formIds = {
      serverLogLevel: 21,
      hashcatBrainEnable: 22
    };

    component.onFormSubmit({
      serverLogLevel: 20,
      hashcatBrainEnable: true
    });

    expect(globalService.update).not.toHaveBeenCalled();
    expect(alertService.showSuccessMessage).not.toHaveBeenCalled();
    expect(alertService.showErrorMessage).not.toHaveBeenCalled();
  });

  it('should show error message when update fails', () => {
    component.formValues = {
      serverLogLevel: 20 as unknown as string | boolean
    } as unknown as typeof component.formValues;
    component.formIds = {
      serverLogLevel: 21
    };

    globalService.update.and.returnValue(throwError(() => new Error('update failed')));

    component.onFormSubmit({ serverLogLevel: 30 });

    expect(alertService.showErrorMessage).toHaveBeenCalledWith('Failed to save ' + component.title);
    expect(alertService.showSuccessMessage).not.toHaveBeenCalled();
  });

  it('should add the notifications menu item when user has read role', () => {
    notificationRoleService.hasRole.and.returnValue(true);
    (component as any).menuItems = [];

    component.ngOnInit();

    expect((component as any).menuItems.some((item: any) => item.label === 'Notifications')).toBeTrue();
  });

  it('should call unsubscribeAll when destroyed', () => {
    const unsubscribeService = TestBed.inject(UnsubscribeService);
    spyOn(unsubscribeService, 'unsubscribeAll');

    component.ngOnDestroy();

    expect(unsubscribeService.unsubscribeAll).toHaveBeenCalled();
  });
});
