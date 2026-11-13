import type { MockedObject } from 'vitest';

import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AutoTitleService } from '@src/app/core/_services/shared/autotitle.service';
import { GlobalpermissionsgroupsComponent } from '@src/app/users/globalpermissionsgroups/globalpermissionsgroups.component';

@Component({ selector: 'app-page', template: '<ng-content></ng-content>', standalone: false })
class StubPageComponent {
  @Input() title: string;
  @Input() actionTitle?: string;
  @Input() actionLink?: string;
  @Input() showAction?: boolean;
}

@Component({ selector: 'app-table', template: '<ng-content></ng-content>', standalone: false })
class StubTableComponent {}

@Component({ selector: 'app-permissions-table', template: '', standalone: false })
class StubPermissionsTableComponent {}

describe('GlobalpermissionsgroupsComponent', () => {
  let fixture: ComponentFixture<GlobalpermissionsgroupsComponent>;
  let mockAutoTitleService: MockedObject<AutoTitleService>;

  beforeEach(async () => {
    mockAutoTitleService = {
      set: vi.fn().mockName('AutoTitleService.set')
    } as MockedObject<AutoTitleService>;

    await TestBed.configureTestingModule({
      declarations: [
        GlobalpermissionsgroupsComponent,
        StubPageComponent,
        StubTableComponent,
        StubPermissionsTableComponent
      ],
      providers: [{ provide: AutoTitleService, useValue: mockAutoTitleService }]
    }).compileComponents();
  });

  it('should set the page title when the component is created', () => {
    fixture = TestBed.createComponent(GlobalpermissionsgroupsComponent);
    fixture.detectChanges();

    expect(mockAutoTitleService.set).toHaveBeenCalledExactlyOnceWith(['Show Global Permissions']);
  });

  it('renders the page title and create action details', () => {
    fixture = TestBed.createComponent(GlobalpermissionsgroupsComponent);
    fixture.detectChanges();

    const page = fixture.debugElement.query(By.directive(StubPageComponent)).componentInstance as StubPageComponent;

    expect(page.title).toBe('Global Permission Groups');
    expect(page.actionTitle).toBe('New Global Permission Group');
    expect(page.actionLink).toBe('/users/global-permissions-groups/new');
    expect(page.showAction).toBe(true);
  });

  it('renders the permissions table inside the table container', () => {
    fixture = TestBed.createComponent(GlobalpermissionsgroupsComponent);
    fixture.detectChanges();

    const tableContainer = fixture.debugElement.query(By.directive(StubTableComponent));

    expect(tableContainer).not.toBeNull();
    expect(tableContainer.query(By.directive(StubPermissionsTableComponent))).not.toBeNull();
  });
});
