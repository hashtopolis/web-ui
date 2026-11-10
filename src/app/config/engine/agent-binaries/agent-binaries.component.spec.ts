import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AgentBinaryRoleService } from '@services/roles/binaries/agent-binary-role.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

import { AgentBinariesComponent } from '@src/app/config/engine/agent-binaries/agent-binaries.component';

@Component({ selector: 'app-page', template: '<ng-content></ng-content>', standalone: false })
class StubPageComponent {
  @Input() title: string;
  @Input() actionTitle?: string;
  @Input() actionLink?: string;
  @Input() showAction?: boolean;
}

@Component({ selector: 'app-table', template: '<ng-content></ng-content>', standalone: false })
class StubTableComponent {}

@Component({ selector: 'app-agent-binaries-table', template: '', standalone: false })
class StubAgentBinariesTableComponent {}

describe('AgentBinariesComponent', () => {
  let fixture: ComponentFixture<AgentBinariesComponent>;
  let hasRole: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    hasRole = vi.fn().mockName('AgentBinaryRoleService.hasRole').mockReturnValue(true);

    await TestBed.configureTestingModule({
      declarations: [AgentBinariesComponent, StubPageComponent, StubTableComponent, StubAgentBinariesTableComponent],
      providers: [
        { provide: AutoTitleService, useValue: { set: vi.fn().mockName('AutoTitleService.set') } },
        { provide: AgentBinaryRoleService, useValue: { hasRole } }
      ]
    }).compileComponents();
  });

  it('renders the page title and create action details', () => {
    fixture = TestBed.createComponent(AgentBinariesComponent);
    fixture.detectChanges();
    const page = fixture.debugElement.query(By.directive(StubPageComponent)).componentInstance as StubPageComponent;

    expect(page.title).toBe('Agent Binaries');
    expect(page.actionTitle).toBe('New Binary');
    expect(page.actionLink).toBe('/config/engine/agent-binaries/new-agent-binary');
    expect(page.showAction).toBe(true);
  });

  it('hides the create action when the user lacks the create role', () => {
    hasRole.mockReturnValue(false);
    fixture = TestBed.createComponent(AgentBinariesComponent);
    fixture.detectChanges();

    const page = fixture.debugElement.query(By.directive(StubPageComponent)).componentInstance as StubPageComponent;

    expect(page.showAction).toBe(false);
  });

  it('renders the agent binaries table inside the table container', () => {
    fixture = TestBed.createComponent(AgentBinariesComponent);
    fixture.detectChanges();
    const tableContainer = fixture.debugElement.query(By.directive(StubTableComponent));

    expect(tableContainer).not.toBeNull();
    expect(tableContainer.query(By.directive(StubAgentBinariesTableComponent))).not.toBeNull();
  });
});
