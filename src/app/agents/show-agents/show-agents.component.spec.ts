import type { MockedObject } from 'vitest';

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AgentRoleService } from '@services/roles/agents/agent-role.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

import { ShowAgentsComponent } from '@src/app/agents/show-agents/show-agents.component';

@Component({
  selector: 'app-page',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
class MockPageComponent {
  @Input() title: string;
  @Input() actionTitle?: string;
  @Input() actionLink?: string;
  @Input() showAction?: boolean;
}

@Component({
  selector: 'app-table',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
class MockTableComponent {}

@Component({
  selector: 'agents-table',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
class MockAgentsTableComponent {
  @Input() name: string;
}

describe('ShowAgentsComponent', () => {
  let fixture: ComponentFixture<ShowAgentsComponent>;

  // Mocks
  let titleServiceSpy: MockedObject<AutoTitleService>;
  let agentRoleServiceSpy: MockedObject<AgentRoleService>;

  const getPage = (): MockPageComponent =>
    fixture.debugElement.query(By.directive(MockPageComponent)).componentInstance as MockPageComponent;

  beforeEach(async () => {
    titleServiceSpy = {
      set: vi.fn().mockName('AutoTitleService.set')
    } as MockedObject<AutoTitleService>;
    agentRoleServiceSpy = {
      hasRole: vi.fn().mockName('AgentRoleService.hasRole')
    } as unknown as MockedObject<AgentRoleService>;

    // Default case role service behavior
    agentRoleServiceSpy.hasRole.mockReturnValue(false);

    await TestBed.configureTestingModule({
      declarations: [ShowAgentsComponent, MockPageComponent, MockTableComponent, MockAgentsTableComponent],
      providers: [
        { provide: AutoTitleService, useValue: titleServiceSpy },
        { provide: AgentRoleService, useValue: agentRoleServiceSpy }
      ]
    }).compileComponents();
  });

  describe('initial state', () => {
    it('should set the page title once on construction', () => {
      fixture = TestBed.createComponent(ShowAgentsComponent);

      expect(titleServiceSpy.set).toHaveBeenCalledExactlyOnceWith(['Agents Overview']);
    });

    it('should pass static inputs to app-page', () => {
      fixture = TestBed.createComponent(ShowAgentsComponent);
      fixture.detectChanges();

      const page = getPage();
      expect(page.title).toBe('Agents Overview');
      expect(page.actionTitle).toBe('New Agent');
      expect(page.actionLink).toBe('/agents/new-agent');
    });

    it('should show the action when the user has the "create" role', () => {
      agentRoleServiceSpy.hasRole.mockImplementation((role: string) => role === 'create');
      fixture = TestBed.createComponent(ShowAgentsComponent);

      fixture.detectChanges();

      vi.when(agentRoleServiceSpy.hasRole).calledWith('create').thenReturn(true);
      expect(agentRoleServiceSpy.hasRole).toHaveBeenCalledWith('create');
      expect(getPage().showAction).toBe(true);
    });

    it('should hide the action when the user lacks the "create" role', () => {
      fixture = TestBed.createComponent(ShowAgentsComponent);
      fixture.detectChanges();

      vi.when(agentRoleServiceSpy.hasRole).calledWith('create').thenReturn(true);
      expect(getPage().showAction).toBe(false);
    });

    it('should render the agents table inside app-table with the correct name', () => {
      fixture = TestBed.createComponent(ShowAgentsComponent);
      fixture.detectChanges();

      const tableEl = fixture.debugElement.query(By.directive(MockTableComponent));
      expect(tableEl).not.toBeNull();
      const agentsTable = tableEl.query(By.directive(MockAgentsTableComponent));
      expect(agentsTable).not.toBeNull();
      expect((agentsTable.componentInstance as MockAgentsTableComponent).name).toBe('agentsTable');
    });
  });
});
