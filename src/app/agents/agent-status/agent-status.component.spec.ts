import type { MockedObject } from 'vitest';

import { ChangeDetectionStrategy, Component, Injector, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

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
export class MockPageComponent {
  @Input()
  title: string;
}

@Component({
  selector: 'app-table',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class MockTableComponent {}

@Component({
  selector: 'app-agents-status-table',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class MockAgentsStatusTableComponent {}

describe('AgentStatusComponent', () => {
  let component: AgentStatusComponent;
  let fixture: ComponentFixture<AgentStatusComponent>;

  // Mocks
  let cookieServiceSpy: MockedObject<CookieService>;
  let autoTitleServiceSpy: MockedObject<AutoTitleService>;

  beforeEach(async () => {
    cookieServiceSpy = {
      getCookie: vi.fn().mockName('CookieService.getCookie'),
      setCookie: vi.fn().mockName('CookieService.setCookie')
    } as unknown as MockedObject<CookieService>;
    autoTitleServiceSpy = {
      set: vi.fn().mockName('AutoTitleService.set')
    } as unknown as MockedObject<AutoTitleService>;

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
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

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

      expect(cookieServiceSpy.getCookie).toHaveBeenCalledTimes(1);
      expect(cookieServiceSpy.getCookie).toHaveBeenCalledWith('asview');
      expect(result).toBe('1');
    });

    it('should return an empty string when the cookie is not set', () => {
      cookieServiceSpy.getCookie.mockReturnValue('');

      const result = component.getView();

      expect(result).toBe('');
    });

    it('should propagate errors thrown by the CookieService', () => {
      cookieServiceSpy.getCookie.mockImplementation(() => {
        throw new Error('Cookie access denied');
      });

      expect(() => component.getView()).toThrow('Cookie access denied');
    });
  });

  describe('ngOnInit', () => {
    it('should set view to the cookie value when cookie exists', () => {
      cookieServiceSpy.getCookie.mockReturnValue('2');

      component.ngOnInit();

      expect(cookieServiceSpy.getCookie).toHaveBeenCalledWith('asview');
      expect(component.view).toBe('2');
    });

    it('should keep "0" string value from cookie since it is truthy', () => {
      cookieServiceSpy.getCookie.mockReturnValue('0');

      component.ngOnInit();

      expect(component.view).toBe('0');
    });

    it('should fall back to 0 when the cookie is an empty string', () => {
      component.view = 5;
      cookieServiceSpy.getCookie.mockReturnValue('');

      component.ngOnInit();

      expect(component.view).toBe(0);
    });

    it.each([null, undefined])('should fall back to 0 when the cookie value is %s', (value) => {
      cookieServiceSpy.getCookie.mockReturnValue(value as unknown as string);

      component.ngOnInit();

      expect(component.view).toBe(0);
    });

    it('should accept arbitrary (unexpected) cookie values unchanged', () => {
      cookieServiceSpy.getCookie.mockReturnValue('invalid-view');

      component.ngOnInit();

      expect(component.view).toBe('invalid-view');
    });

    it('should set the page title via AutoTitleService (@PageTitle decorator)', () => {
      component.ngOnInit();

      expect(autoTitleServiceSpy.set).toHaveBeenCalledTimes(1);
      expect(autoTitleServiceSpy.set).toHaveBeenCalledWith(['Agent Status']);
    });

    it('should propagate errors from CookieService and not set the page title', () => {
      cookieServiceSpy.getCookie.mockImplementation(() => {
        throw new Error('Cookie access denied');
      });

      expect(() => component.ngOnInit()).toThrow('Cookie access denied');
      expect(component.view).toBe(0);
      expect(autoTitleServiceSpy.set).not.toHaveBeenCalled();
    });

    it('should be invoked by angular on first change detection', () => {
      cookieServiceSpy.getCookie.mockReturnValue('1');

      fixture.detectChanges();

      expect(component.view).toBe('1');
      expect(autoTitleServiceSpy.set).toHaveBeenCalledWith(['Agent Status']);
    });
  });

  describe('template', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should pass the pageTitle to app-page', () => {
      const page = fixture.debugElement.query(By.directive(MockPageComponent));

      expect(page).toBeTruthy();
      expect((page.componentInstance as MockPageComponent).title).toBe('Agents Status');
    });

    it('should render the agents status table inside app-table', () => {
      const table = fixture.debugElement.query(By.directive(MockTableComponent));
      const statusTable = table.query(By.directive(MockAgentsStatusTableComponent));

      expect(table).toBeTruthy();
      expect(statusTable).toBeTruthy();
    });

    it('should update app-page title when pageTitle changes', () => {
      component.pageTitle = 'Changed Title';

      fixture.detectChanges();
      const page = fixture.debugElement.query(By.directive(MockPageComponent));

      expect((page.componentInstance as MockPageComponent).title).toBe('Changed Title');
    });
  });
});
