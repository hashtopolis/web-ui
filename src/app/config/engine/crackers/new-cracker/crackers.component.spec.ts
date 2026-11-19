import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CrackerBinaryRoleService } from '@services/roles/binaries/cracker-binary-role.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

import { CrackersComponent } from '@src/app/config/engine/crackers/crackers.component';

@Component({ selector: 'app-page', template: '<ng-content></ng-content>', standalone: false })
class StubPageComponent {
  @Input() title: string;
  @Input() actionTitle?: string;
  @Input() actionLink?: string;
  @Input() showAction?: boolean;
}

@Component({ selector: 'app-table', template: '<ng-content></ng-content>', standalone: false })
class StubTableComponent {}

@Component({ selector: 'app-crackers-table', template: '', standalone: false })
class StubCrackersTableComponent {}

describe('CrackersComponent', () => {
  let fixture: ComponentFixture<CrackersComponent>;
  let hasRole: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    hasRole = vi.fn().mockName('CrackerBinaryRoleService.hasRole').mockReturnValue(true);

    await TestBed.configureTestingModule({
      declarations: [CrackersComponent, StubPageComponent, StubTableComponent, StubCrackersTableComponent],
      providers: [
        { provide: AutoTitleService, useValue: { set: vi.fn().mockName('AutoTitleService.set') } },
        { provide: CrackerBinaryRoleService, useValue: { hasRole } }
      ]
    }).compileComponents();
  });

  it('renders the page title and create action details', () => {
    fixture = TestBed.createComponent(CrackersComponent);
    fixture.detectChanges();
    const page = fixture.debugElement.query(By.directive(StubPageComponent)).componentInstance as StubPageComponent;

    expect(page.title).toBe('Crackers');
    expect(page.actionTitle).toBe('New Cracker');
    expect(page.actionLink).toBe('/config/engine/crackers/new');
    expect(page.showAction).toBe(true);
  });

  it('hides the create action when the user lacks the create role', () => {
    hasRole.mockReturnValue(false);
    fixture = TestBed.createComponent(CrackersComponent);
    fixture.detectChanges();

    const page = fixture.debugElement.query(By.directive(StubPageComponent)).componentInstance as StubPageComponent;

    expect(page.showAction).toBe(false);
  });

  it('renders the crackers table inside the table container', () => {
    fixture = TestBed.createComponent(CrackersComponent);
    fixture.detectChanges();
    const tableContainer = fixture.debugElement.query(By.directive(StubTableComponent));

    expect(tableContainer).not.toBeNull();
    expect(tableContainer.query(By.directive(StubCrackersTableComponent))).not.toBeNull();
  });
});
