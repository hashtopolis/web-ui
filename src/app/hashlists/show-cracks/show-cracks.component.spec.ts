import type { MockedObject } from 'vitest';

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AutoTitleService } from '@services/shared/autotitle.service';

import { ShowCracksComponent } from '@src/app/hashlists/show-cracks/show-cracks.component';

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
});
