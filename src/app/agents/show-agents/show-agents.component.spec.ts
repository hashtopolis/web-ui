import type { MockedObject } from 'vitest';

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AgentRoleService } from '@services/roles/agents/agent-role.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

import { ShowAgentsComponent } from '@src/app/agents/show-agents/show-agents.component';

// Mock components for child selectors used in the template
@Component({
  selector: 'app-page',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
class MockPageComponent {
  @Input() title: string;
  @Input() subtitle?: string;
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
  let component: ShowAgentsComponent;
  let fixture: ComponentFixture<ShowAgentsComponent>;

  // Mocks
  let titleServiceSpy: MockedObject<AutoTitleService>;
  let agentRoleServiceSpy: MockedObject<AgentRoleService>;

  const getPage = (): MockPageComponent =>
    fixture.debugElement.query(By.directive(MockPageComponent)).componentInstance as MockPageComponent;

  beforeEach(async () => {
    titleServiceSpy = {
      set: vi.fn().mockName('AutoTitleService.set')
    } as unknown as MockedObject<AutoTitleService>;
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

    fixture = TestBed.createComponent(ShowAgentsComponent);
    component = fixture.componentInstance;
  });

  describe('initial state', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should set the page title once on construction', () => {
      expect(titleServiceSpy.set).toHaveBeenCalledTimes(1);
      expect(titleServiceSpy.set).toHaveBeenCalledWith(['Agents Overview']);
    });

    it('should pass static inputs to app-page', () => {
      fixture.detectChanges();

      const page = getPage();
      expect(page.title).toBe('Agents Overview');
      expect(page.actionTitle).toBe('New Agent');
      expect(page.actionLink).toBe('/agents/new-agent');
    });

    it('should show the action when the user has the "create" role', () => {
      agentRoleServiceSpy.hasRole.mockImplementation((role: string) => role === 'create');

      fixture.detectChanges();

      expect(agentRoleServiceSpy.hasRole).toHaveBeenCalledWith('create');
      expect(getPage().showAction).toBe(true);
    });

    it('should render the agents table inside app-table with the correct name', () => {
      fixture.detectChanges();

      const tableEl = fixture.debugElement.query(By.directive(MockTableComponent));
      expect(tableEl).toBeTruthy();
      const agentsTable = tableEl.query(By.directive(MockAgentsTableComponent));
      expect(agentsTable).toBeTruthy();
      expect((agentsTable.componentInstance as MockAgentsTableComponent).name).toBe('agentsTable');
    });
  });

  describe('Edge Cases', () => {
    it('should hide the action when the user lacks the "create" role', () => {
      agentRoleServiceSpy.hasRole.mockReturnValue(false);

      fixture.detectChanges();

      expect(agentRoleServiceSpy.hasRole).toHaveBeenCalledWith('create');
      expect(getPage().showAction).toBe(false);
    });

    it('should pass through an undefined role result unchanged', () => {
      agentRoleServiceSpy.hasRole.mockReturnValue(undefined as unknown as boolean);

      fixture.detectChanges();

      expect(getPage().showAction).toBeUndefined();
    });

    it('should update showAction when the role changes between change detection cycles', () => {
      agentRoleServiceSpy.hasRole.mockReturnValue(false);
      fixture.detectChanges();
      expect(getPage().showAction).toBe(false);

      agentRoleServiceSpy.hasRole.mockReturnValue(true);
      fixture.detectChanges();

      expect(getPage().showAction).toBe(true);
    });
  });

  describe('Error Cases', () => {
    it('should propagate errors thrown by the title service during construction', () => {
      titleServiceSpy.set.mockImplementation(() => {
        throw new Error('title error');
      });

      expect(() => TestBed.createComponent(ShowAgentsComponent)).toThrow('title error');
    });

    it('should propagate errors thrown by the role service during rendering', () => {
      agentRoleServiceSpy.hasRole.mockImplementation(() => {
        throw new Error('role error');
      });

      expect(() => fixture.detectChanges()).toThrow('role error');
    });
  });
});
