import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

import { HashListRoleService } from '@services/roles/hashlists/hashlist-role.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

import { HashlistComponent } from '@src/app/hashlists/hashlist/hashlist.component';

@Component({
  selector: 'app-hashlists-table',
  template: '<table></table>',
  standalone: false
})
class MockHashlistsTableComponent {
  setIsArchived = jasmine.createSpy('setIsArchived');
}

describe('HashlistComponent', () => {
  let component: HashlistComponent;
  let fixture: ComponentFixture<HashlistComponent>;

  let titleService: jasmine.SpyObj<AutoTitleService>;
  let roleService: jasmine.SpyObj<HashListRoleService>;
  let mockTable: MockHashlistsTableComponent;

  beforeEach(async () => {
    titleService = jasmine.createSpyObj('AutoTitleService', ['set']);
    roleService = jasmine.createSpyObj('HashListRoleService', ['hasRole']);

    await TestBed.configureTestingModule({
      declarations: [HashlistComponent, MockHashlistsTableComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: AutoTitleService, useValue: titleService },
        { provide: HashListRoleService, useValue: roleService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HashlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    mockTable = component.table as unknown as MockHashlistsTableComponent;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set page title to "Show Hashlists" on init', () => {
    expect(titleService.set).toHaveBeenCalledWith(['Show Hashlists']);
  });

  describe('showCreateButton', () => {
    it('should be true when user has create role', () => {
      roleService.hasRole.withArgs('create').and.returnValue(true);
      const compWithRole = TestBed.createComponent(HashlistComponent).componentInstance;
      expect(compWithRole.showCreateButton).toBeTrue();
    });

    it('should be false when user does not have create role', () => {
      roleService.hasRole.withArgs('create').and.returnValue(false);
      const compWithoutRole = TestBed.createComponent(HashlistComponent).componentInstance;
      expect(compWithoutRole.showCreateButton).toBeFalse();
    });
  });

  describe('toggleIsArchived', () => {
    it('should call table.setIsArchived(false) and set pageTitle to "Hashlists" when toggled off', () => {
      const event = { checked: false } as MatSlideToggleChange;
      component.toggleIsArchived(event);

      expect(mockTable.setIsArchived).toHaveBeenCalledWith(false);
      expect(component.pageTitle).toBe('Hashlists');
    });

    it('should call table.setIsArchived(true) and set pageTitle to "Hashlists (archived)" when toggled on', () => {
      const event = { checked: true } as MatSlideToggleChange;
      component.toggleIsArchived(event);

      expect(mockTable.setIsArchived).toHaveBeenCalledWith(true);
      expect(component.pageTitle).toBe('Hashlists (archived)');
    });
  });
});
