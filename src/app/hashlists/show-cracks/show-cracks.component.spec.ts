import type { MockedObject } from 'vitest';

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AutoTitleService } from '@services/shared/autotitle.service';

import { ShowCracksComponent } from '@src/app/hashlists/show-cracks/show-cracks.component';

// Mock components for child selectors used in the template
@Component({
  selector: 'app-page',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
class MockPageComponent {
  @Input() title = '';
}

@Component({
  selector: 'app-table',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
class MockTableComponent {}

@Component({
  selector: 'app-cracks-table',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
class MockCracksTableComponent {}

describe('ShowCracksComponent', () => {
  let fixture: ComponentFixture<ShowCracksComponent>;
  let titleServiceSpy: MockedObject<Pick<AutoTitleService, 'set'>>;

  beforeEach(async () => {
    titleServiceSpy = {
      set: vi.fn<AutoTitleService['set']>().mockName('AutoTitleService.set')
    };

    await TestBed.configureTestingModule({
      declarations: [ShowCracksComponent, MockPageComponent, MockTableComponent, MockCracksTableComponent],
      providers: [{ provide: AutoTitleService, useValue: titleServiceSpy }]
    }).compileComponents();
  });

  it('should create the component and set the title once during construction', () => {
    fixture = TestBed.createComponent(ShowCracksComponent);

    expect(fixture.componentInstance).toBeInstanceOf(ShowCracksComponent);
    expect(titleServiceSpy.set).toHaveBeenCalledExactlyOnceWith(['Show Cracks']);
  });

  it('should render the cracks table inside the table and page with the page title', () => {
    fixture = TestBed.createComponent(ShowCracksComponent);

    fixture.detectChanges();

    const page = fixture.debugElement.query(By.directive(MockPageComponent));
    expect(page).not.toBeNull();
    expect(page.injector.get(MockPageComponent).title).toBe('Cracks');
    const table = page.query(By.directive(MockTableComponent));
    expect(table).not.toBeNull();
    expect(table.queryAll(By.directive(MockCracksTableComponent))).toHaveLength(1);
  });

  it('should not set the title again during repeated change detection or destruction', () => {
    fixture = TestBed.createComponent(ShowCracksComponent);
    titleServiceSpy.set.mockClear();

    fixture.detectChanges();
    fixture.detectChanges();
    fixture.destroy();

    expect(titleServiceSpy.set).not.toHaveBeenCalled();
  });

  it('should set the title again with a fresh array when the component is recreated', () => {
    fixture = TestBed.createComponent(ShowCracksComponent);
    const firstTitle = titleServiceSpy.set.mock.calls[0][0];
    fixture.destroy();

    const secondFixture = TestBed.createComponent(ShowCracksComponent);

    expect(secondFixture.componentInstance).not.toBe(fixture.componentInstance);
    expect(titleServiceSpy.set).toHaveBeenCalledTimes(2);
    expect(titleServiceSpy.set).toHaveBeenNthCalledWith(2, ['Show Cracks']);
    expect(titleServiceSpy.set.mock.calls[1][0]).not.toBe(firstTitle);
  });

  it.each([new Error('Title service failed'), new TypeError('Invalid title service configuration')])(
    'should propagate a title service error during construction: %s',
    (error) => {
      titleServiceSpy.set.mockImplementation(() => {
        throw error;
      });

      const createComponent = () => TestBed.createComponent(ShowCracksComponent);

      expect(createComponent).toThrow(error);
      expect(titleServiceSpy.set).toHaveBeenCalledExactlyOnceWith(['Show Cracks']);
    }
  );
});
