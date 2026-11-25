import type { MockedObject } from 'vitest';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseModel } from '@models/base.model';

import { ContextMenuService, ContextMenuType } from '@services/context-menu/base/context-menu.service';

import { RowActionMenuComponent } from '@components/menus/row-action-menu/row-action-menu.component';

interface MenuData extends BaseModel {
  active: boolean;
}

describe('RowActionMenuComponent', () => {
  let component: RowActionMenuComponent;
  let fixture: ComponentFixture<RowActionMenuComponent>;
  let contextMenuServiceSpy: MockedObject<ContextMenuService>;

  beforeEach(async () => {
    contextMenuServiceSpy = {
      getMenuItems: vi.fn().mockName('ContextMenuService.getMenuItems')
    } as MockedObject<ContextMenuService>;
    contextMenuServiceSpy.getMenuItems.mockReturnValue([]);

    await TestBed.configureTestingModule({
      declarations: [RowActionMenuComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(RowActionMenuComponent);
    component = fixture.componentInstance;
  });

  it('should add only menu items whose conditions match the row data', () => {
    const activeItem: ContextMenuType = {
      index: 0,
      menuItem: { label: 'Active action' },
      condition: { key: 'active', value: true }
    };
    const inactiveItem: ContextMenuType = {
      index: 0,
      menuItem: { label: 'Inactive action' },
      condition: { key: 'active', value: false }
    };
    const unconditionalItem: ContextMenuType = {
      index: 1,
      menuItem: { label: 'Always available' }
    };
    contextMenuServiceSpy.getMenuItems.mockReturnValue([activeItem, inactiveItem, unconditionalItem]);
    fixture.componentRef.setInput('data', { id: 1, type: 'agent', active: true } satisfies MenuData);
    fixture.componentRef.setInput('contextMenuService', contextMenuServiceSpy);

    fixture.detectChanges();

    expect(contextMenuServiceSpy.getMenuItems).toHaveBeenCalledExactlyOnceWith();
    expect(component.actionMenuItems).toStrictEqual([[activeItem.menuItem], [unconditionalItem.menuItem]]);
    expect(component.disabled).toBe(false);
  });

  it('should disable the menu when the service has no menu items', () => {
    fixture.componentRef.setInput('data', { id: 1, type: 'agent', active: true } satisfies MenuData);
    fixture.componentRef.setInput('contextMenuService', contextMenuServiceSpy);

    fixture.detectChanges();

    expect(contextMenuServiceSpy.getMenuItems).toHaveBeenCalledExactlyOnceWith();
    expect(component.actionMenuItems).toStrictEqual([]);
    expect(component.disabled).toBe(true);
  });

  it('should disable the menu when no context menu service is provided', () => {
    fixture.componentRef.setInput('data', { id: 1, type: 'agent', active: true } satisfies MenuData);

    fixture.detectChanges();

    expect(contextMenuServiceSpy.getMenuItems).not.toHaveBeenCalled();
    expect(component.actionMenuItems).toStrictEqual([]);
    expect(component.disabled).toBe(true);
  });

  it('should remain disabled when actions exist but the disabled input is true', () => {
    contextMenuServiceSpy.getMenuItems.mockReturnValue([{ index: 0, menuItem: { label: 'Available action' } }]);
    fixture.componentRef.setInput('data', { id: 1, type: 'agent', active: true } satisfies MenuData);
    fixture.componentRef.setInput('contextMenuService', contextMenuServiceSpy);
    fixture.componentRef.setInput('disabled', true);

    fixture.detectChanges();

    expect(component.actionMenuItems).toStrictEqual([[{ label: 'Available action' }]]);
    expect(component.disabled).toBe(true);
  });
});
