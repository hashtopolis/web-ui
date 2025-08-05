import { of } from 'rxjs';

import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';

import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';
import { ConfigService } from '@services/shared/config.service';

import { NewAgentComponent } from '@src/app/agents/new-agent/new-agent.component';
import { ButtonsModule } from '@src/app/shared/buttons/buttons.module';
import { PageTitleModule } from '@src/app/shared/page-headers/page-title.module';
import { TableModule } from '@src/app/shared/table/table-actions.module';

// AgentBinary table mock
@Component({
  selector: 'app-agent-binaries-table',
  template: '',
  standalone: false
})
export class MockAgentBinariesTableComponent {
  @Input() isSelectable: boolean;
}

// Voucher table mock
@Component({
  selector: 'app-vouchers-table',
  template: '',
  standalone: false
})
export class MockVouchersTableComponent {}

describe('NewAgentComponent', () => {
  let component: NewAgentComponent;
  let fixture: ComponentFixture<NewAgentComponent>;

  // Mocks
  let clipboardSpy: jasmine.SpyObj<Clipboard>;
  let alertServiceSpy: jasmine.SpyObj<AlertService>;
  let configServiceSpy: jasmine.SpyObj<ConfigService>;
  let globalServiceSpy: jasmine.SpyObj<GlobalService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    clipboardSpy = jasmine.createSpyObj('Clipboard', ['copy']);
    alertServiceSpy = jasmine.createSpyObj('AlertService', ['showSuccessMessage']);
    configServiceSpy = jasmine.createSpyObj('ConfigService', ['getEndpoint']);
    globalServiceSpy = jasmine.createSpyObj('GlobalService', ['create']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    // Provide default stub for configService.getEndpoint()
    configServiceSpy.getEndpoint.and.returnValue('http://localhost:8080/api/v2');

    await TestBed.configureTestingModule({
      declarations: [NewAgentComponent, MockAgentBinariesTableComponent, MockVouchersTableComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        NoopAnimationsModule,
        MatStepperModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        PageTitleModule,
        ButtonsModule,
        TableModule
      ],
      providers: [
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
    expect(component.form.get('voucher').value).toBeTruthy();
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
    expect(component.isValid()).toBeTrue();
  });

  it('should return false if voucher is empty', () => {
    component.form.setValue({ voucher: '' });
    expect(component.isValid()).toBeFalse();
  });

  it('should generate a voucher and set it into the form', fakeAsync(() => {
    const fakeVoucher = 'fy7vjq56';

    // Let internal generation method return a fake voucher
    spyOn(component, 'generateVoucher').and.returnValue(fakeVoucher);
    // Spy on the updateVoucher method to ensure it is called
    spyOn(component, 'updateVoucher').and.callThrough();

    fixture.detectChanges();

    // Click the refresh button to trigger voucher generation
    const refreshButton = fixture.nativeElement.querySelector(
      '[data-testid="generate-voucher-button"]'
    ) as HTMLButtonElement;
    expect(refreshButton).toBeTruthy();
    refreshButton.click();
    tick();
    fixture.detectChanges();

    // Expect form to contain the generated voucher
    expect(component.generateVoucher).toHaveBeenCalled();
    expect(component.form.get('voucher')?.value).toBe(fakeVoucher);
    expect(component.updateVoucher).toHaveBeenCalled();
  }));

  it('should call create service and reload table when add button is clicked', fakeAsync(() => {
    // Set voucher value in the form
    const voucher = 'fy7vjq56';
    component.form.controls['voucher'].setValue(voucher);
    component.form.updateValueAndValidity();
    expect(component.form.valid).toBeTrue();

    // Spy on table reload and global service create method
    component.table = jasmine.createSpyObj('VouchersTableComponent', ['reload']);
    globalServiceSpy.create.and.returnValue(of({}));

    const addButton = fixture.nativeElement.querySelector('[data-testid="add-voucher-button"]') as HTMLButtonElement;
    expect(addButton).toBeTruthy();
    expect(addButton.disabled).toBeFalse(); // ensure the button is enabled

    addButton.click();
    tick();
    fixture.detectChanges();

    expect(globalServiceSpy.create).toHaveBeenCalledWith(SERV.VOUCHER, { voucher: voucher });
    expect(alertServiceSpy.showSuccessMessage).toHaveBeenCalledWith('New voucher successfully created!');
    expect(component.table.reload).toHaveBeenCalled();
  }));

  it('should unsubscribe on destroy', () => {
    // Setup subscription spy
    component.newVoucherSubscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
    component.ngOnDestroy();
    expect(component.newVoucherSubscription.unsubscribe).toHaveBeenCalled();
  });
});
