import type { MockedObject } from 'vitest';

import { ChangeDetectionStrategy, Component, Injector, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoTitleService } from '@services/shared/autotitle.service';

import { AgentStatusComponent } from '@src/app/agents/agent-status/agent-status.component';
import { AppModule } from '@src/app/app.module';
import { CookieService } from '@src/app/core/_services/shared/cookies.service';

// Mock components for child selectors used in the template
@Component({
  selector: 'app-page',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
class MockPageComponent {
  @Input()
  title: string;
}

@Component({
  selector: 'app-table',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
class MockTableComponent {}

@Component({
  selector: 'app-agents-status-table',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
class MockAgentsStatusTableComponent {}

describe('AgentStatusComponent', () => {
  let component: AgentStatusComponent;
  let fixture: ComponentFixture<AgentStatusComponent>;

  // Mocks
  let cookieServiceSpy: MockedObject<CookieService>;
  let autoTitleServiceSpy: MockedObject<AutoTitleService>;

  beforeEach(async () => {
    cookieServiceSpy = {
      getCookie: vi.fn().mockName('CookieService.getCookie')
    } as MockedObject<CookieService>;
    autoTitleServiceSpy = {
      set: vi.fn().mockName('AutoTitleService.set')
    } as MockedObject<AutoTitleService>;

    // Default case, no cookie stored
    cookieServiceSpy.getCookie.mockReturnValue('');

    await TestBed.configureTestingModule({
      declarations: [AgentStatusComponent, MockPageComponent, MockTableComponent, MockAgentsStatusTableComponent],
      providers: [
        { provide: CookieService, useValue: cookieServiceSpy },
        { provide: AutoTitleService, useValue: autoTitleServiceSpy }
      ]
    }).compileComponents();

    AppModule.injector = TestBed.inject(Injector);

    fixture = TestBed.createComponent(AgentStatusComponent);
    component = fixture.componentInstance;
  });

  describe('initial state', () => {
    it('should have default pageTitle and view before ngOnInit', () => {
      expect(component.pageTitle).toBe('Agents Status');
      expect(component.view).toBe(0);
      expect(cookieServiceSpy.getCookie).not.toHaveBeenCalled();
    });
  });

  describe('getView', () => {
    it('should read the "asview" cookie and return its value', () => {
      cookieServiceSpy.getCookie.mockReturnValue('1');

      const result = component.getView();

      expect(cookieServiceSpy.getCookie).toHaveBeenCalledExactlyOnceWith('asview');
      expect(result).toBe('1');
    });

    it('should return an empty string when the cookie is not set', () => {
      cookieServiceSpy.getCookie.mockReturnValue('');

      const result = component.getView();

      expect(result).toBe('');
    });
  });

  describe('ngOnInit', () => {
    it('should set view to the cookie value when cookie exists', () => {
      cookieServiceSpy.getCookie.mockReturnValue('2');

      component.ngOnInit();

      expect(cookieServiceSpy.getCookie).toHaveBeenCalledExactlyOnceWith('asview');
      expect(component.view).toBe('2');
    });

    it('should fall back to 0 when the cookie is an empty string', () => {
      component.view = 5;
      cookieServiceSpy.getCookie.mockReturnValue('');

      component.ngOnInit();

      expect(component.view).toBe(0);
    });

    it('should set the page title via AutoTitleService (@PageTitle decorator)', () => {
      component.ngOnInit();

      expect(autoTitleServiceSpy.set).toHaveBeenCalledExactlyOnceWith(['Agent Status']);
    });

    it('should be invoked by angular on first change detection', () => {
      cookieServiceSpy.getCookie.mockReturnValue('1');

      fixture.detectChanges();

      expect(component.view).toBe('1');
      expect(autoTitleServiceSpy.set).toHaveBeenCalledExactlyOnceWith(['Agent Status']);
    });
  });
});
