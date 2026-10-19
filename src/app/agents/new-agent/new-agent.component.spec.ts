import { of } from 'rxjs';
import type { MockedObject } from 'vitest';

import { Clipboard } from '@angular/cdk/clipboard';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { Router } from '@angular/router';

import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';
import { ConfigService } from '@services/shared/config.service';

import { NewAgentComponent } from '@src/app/agents/new-agent/new-agent.component';
import { VouchersTableComponent } from '@src/app/core/_components/tables/vouchers-table/vouchers-table.component';
import { ButtonsModule } from '@src/app/shared/buttons/buttons.module';
import { PageTitleModule } from '@src/app/shared/page-headers/page-title.module';
import { TableModule } from '@src/app/shared/table/table-actions.module';
import { provideDisabledMaterialAnimations } from '@src/app/testing/material-animations';
import { mockResponse } from '@src/app/testing/mock-response';

// AgentBinary table mock
@Component({
  selector: 'app-agent-binaries-table',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class MockAgentBinariesTableComponent {
  @Input()
  isSelectable: boolean;
}

// Voucher table mock
@Component({
  selector: 'app-vouchers-table',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class MockVouchersTableComponent {}

describe('NewAgentComponent', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });
  let component: NewAgentComponent;
  let fixture: ComponentFixture<NewAgentComponent>;

  // Mocks
  let clipboardSpy: MockedObject<Clipboard>;
  let alertServiceSpy: MockedObject<AlertService>;
  let configServiceSpy: MockedObject<ConfigService>;
  let globalServiceSpy: MockedObject<GlobalService>;
  let routerSpy: MockedObject<Router>;

  beforeEach(async () => {
    clipboardSpy = {
      copy: vi.fn().mockName('Clipboard.copy')
    } as MockedObject<Clipboard>;
    alertServiceSpy = {
      showSuccessMessage: vi.fn().mockName('AlertService.showSuccessMessage')
    } as MockedObject<AlertService>;
    configServiceSpy = {
      getEndpoint: vi.fn().mockName('ConfigService.getEndpoint')
    } as MockedObject<ConfigService>;
    globalServiceSpy = {
      create: vi.fn().mockName('GlobalService.create'),
      getAll: vi.fn().mockName('GlobalService.getAll')
    } as MockedObject<GlobalService>;
    routerSpy = {
      navigate: vi.fn().mockName('Router.navigate')
    } as MockedObject<Router>;

    // Provide default stub for configService.getEndpoint()
    configServiceSpy.getEndpoint.mockReturnValue('http://localhost:8080/api/v2');
    globalServiceSpy.getAll.mockReturnValue(of(mockResponse()));

    await TestBed.configureTestingModule({
      declarations: [NewAgentComponent, MockAgentBinariesTableComponent, MockVouchersTableComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatStepperModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        PageTitleModule,
        ButtonsModule,
        TableModule
      ],
      providers: [
        provideDisabledMaterialAnimations(),
        { provide: Clipboard, useValue: clipboardSpy },
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: ConfigService, useValue: configServiceSpy },
        { provide: GlobalService, useValue: globalServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NewAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component and initialize form', () => {
    expect(component).toBeTruthy();
    expect(component.form).toBeDefined();
    expect(component.form.controls.voucher.value).toBeTruthy();
  });

  it('should generate a voucher of length 8', () => {
    const voucher = component.generateVoucher();
    expect(voucher).toBeDefined();
    expect(voucher.length).toBe(8);
  });

  it('should copy agent URL and show success message', () => {
    component.agentURL = 'http://test-agent-url/';
    component.copyAgentURL();
    expect(clipboardSpy.copy).toHaveBeenCalledWith('http://test-agent-url/');
    expect(alertServiceSpy.showSuccessMessage).toHaveBeenCalledWith(
      'The agent register URL is copied to the clipboard'
    );
  });

  it('should return true if form is valid and voucher is not empty', () => {
    component.form.setValue({ voucher: 'fy7vjq56' });
    expect(component.isValid()).toBe(true);
  });

  it('should return false if voucher is empty', () => {
    component.form.setValue({ voucher: '' });
    expect(component.isValid()).toBe(false);
  });

  it('should generate a voucher and set it into the form', async () => {
    const fakeVoucher = 'fy7vjq56';

    // Let internal generation method return a fake voucher
    vi.spyOn(component, 'generateVoucher').mockReturnValue(fakeVoucher);
    // Spy on the updateVoucher method to ensure it is called
    vi.spyOn(component, 'updateVoucher');

    fixture.detectChanges();

    // Click the refresh button to trigger voucher generation
    const refreshButton = fixture.nativeElement.querySelector(
      '[data-testid="generate-voucher-button"]'
    ) as HTMLButtonElement;
    expect(refreshButton).toBeTruthy();
    refreshButton.click();
    await vi.advanceTimersByTimeAsync(0);
    fixture.detectChanges();

    // Expect form to contain the generated voucher
    expect(component.generateVoucher).toHaveBeenCalled();
    expect(component.form.controls.voucher.value).toBe(fakeVoucher);
    expect(component.updateVoucher).toHaveBeenCalled();
  });

  it('should call create service and reload table when add button is clicked', async () => {
    // Set voucher value in the form
    const voucher = 'fy7vjq56';
    component.form.controls.voucher.setValue(voucher);
    component.form.updateValueAndValidity();
    expect(component.form.valid).toBe(true);

    // Spy on table reload and global service create method
    component.table = {
      reload: vi.fn().mockName('VouchersTableComponent.reload')
    } as unknown as MockedObject<VouchersTableComponent>;
    globalServiceSpy.create.mockReturnValue(of(mockResponse()));

    const addButton = fixture.nativeElement.querySelector('[data-testid="add-voucher-button"]') as HTMLButtonElement;
    expect(addButton).toBeTruthy();
    expect(addButton.disabled).toBe(false); // ensure the button is enabled

    addButton.click();
    await vi.advanceTimersByTimeAsync(0);
    fixture.detectChanges();

    expect(globalServiceSpy.create).toHaveBeenCalledWith(SERV.VOUCHER, { voucher: voucher });
    expect(alertServiceSpy.showSuccessMessage).toHaveBeenCalledWith('New voucher successfully created!');
    expect(component.table.reload).toHaveBeenCalled();
  });
});
