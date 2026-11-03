import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { PreprocessorRoleService } from '@services/roles/binaries/preprocessor-role.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

import { PreprocessorsComponent } from '@src/app/config/engine/preprocessors/preprocessors.component';

@Component({ selector: 'app-page', template: '<ng-content></ng-content>', standalone: false })
class StubPageComponent {
  @Input() title: string;
  @Input() actionTitle?: string;
  @Input() actionLink?: string;
  @Input() showAction?: boolean;
}

@Component({ selector: 'app-table', template: '<ng-content></ng-content>', standalone: false })
class StubTableComponent {}

@Component({ selector: 'app-preprocessors-table', template: '', standalone: false })
class StubPreprocessorsTableComponent {}

describe('PreprocessorsComponent', () => {
  let fixture: ComponentFixture<PreprocessorsComponent>;
  let hasRole: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    hasRole = vi.fn().mockName('PreprocessorRoleService.hasRole').mockReturnValue(true);

    await TestBed.configureTestingModule({
      declarations: [PreprocessorsComponent, StubPageComponent, StubTableComponent, StubPreprocessorsTableComponent],
      providers: [
        { provide: AutoTitleService, useValue: { set: vi.fn().mockName('AutoTitleService.set') } },
        { provide: PreprocessorRoleService, useValue: { hasRole } }
      ]
    }).compileComponents();
  });

  it('renders the page title and create action details', () => {
    fixture = TestBed.createComponent(PreprocessorsComponent);
    fixture.detectChanges();
    const page = fixture.debugElement.query(By.directive(StubPageComponent)).componentInstance as StubPageComponent;

    expect(page.title).toBe('Preprocessors');
    expect(page.actionTitle).toBe('New Preprocessor');
    expect(page.actionLink).toBe('/config/engine/preprocessors/new-preprocessor');
    expect(page.showAction).toBe(true);
  });

  it('hides the create action when the user lacks the create role', () => {
    hasRole.mockReturnValue(false);
    fixture = TestBed.createComponent(PreprocessorsComponent);
    fixture.detectChanges();

    const page = fixture.debugElement.query(By.directive(StubPageComponent)).componentInstance as StubPageComponent;

    expect(page.showAction).toBe(false);
  });

  it('renders the preprocessors table inside the table container', () => {
    fixture = TestBed.createComponent(PreprocessorsComponent);
    fixture.detectChanges();
    const tableContainer = fixture.debugElement.query(By.directive(StubTableComponent));

    expect(tableContainer).not.toBeNull();
    expect(tableContainer.query(By.directive(StubPreprocessorsTableComponent))).not.toBeNull();
  });
});
