import type { MockedObject } from 'vitest';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextMenuService, ContextMenuType } from '@services/context-menu/base/context-menu.service';

import { BulkActionMenuComponent } from '@components/menus/bulk-action-menu/bulk-action-menu.component';

describe('BulkActionMenuComponent', () => {
  let component: BulkActionMenuComponent;
  let fixture: ComponentFixture<BulkActionMenuComponent>;
  let contextMenuServiceSpy: MockedObject<ContextMenuService>;

  beforeEach(async () => {
    contextMenuServiceSpy = {
      getBulkMenuItems: vi.fn().mockName('ContextMenuService.getBulkMenuItems')
    } as MockedObject<ContextMenuService>;
    contextMenuServiceSpy.getBulkMenuItems.mockReturnValue([]);

    await TestBed.configureTestingModule({
      declarations: [BulkActionMenuComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(BulkActionMenuComponent);
    component = fixture.componentInstance;
  });

  it('should initialize bulk data and add menu items that match it', () => {
    const activeItem: ContextMenuType = {
      index: 0,
      menuItem: { label: 'Archived action' },
      condition: { key: 'isArchived', value: true }
    };
    const inactiveItem: ContextMenuType = {
      index: 0,
      menuItem: { label: 'Active action' },
      condition: { key: 'isArchived', value: false }
    };
    const unconditionalItem: ContextMenuType = {
      index: 1,
      menuItem: { label: 'Always available' }
    };
    contextMenuServiceSpy.getBulkMenuItems.mockReturnValue([activeItem, inactiveItem, unconditionalItem]);
    fixture.componentRef.setInput('dataType', 'agents');
    fixture.componentRef.setInput('isArchived', true);
    fixture.componentRef.setInput('contextMenuService', contextMenuServiceSpy);

    fixture.detectChanges();

    expect(component.data).toStrictEqual({ id: 0, type: 'bulk', isArchived: true });
    expect(contextMenuServiceSpy.getBulkMenuItems).toHaveBeenCalledExactlyOnceWith();
    expect(component.actionMenuItems).toStrictEqual([[activeItem.menuItem], [unconditionalItem.menuItem]]);
  });

  it('should keep the menu empty when there is no context menu service', () => {
    fixture.componentRef.setInput('isArchived', false);

    fixture.detectChanges();

    expect(component.data).toStrictEqual({ id: 0, type: 'bulk', isArchived: false });
    expect(component.actionMenuItems).toStrictEqual([]);
  });

  it('should load current menu items when reloaded', () => {
    const item: ContextMenuType = {
      index: 0,
      menuItem: { label: 'Available after reload' }
    };
    contextMenuServiceSpy.getBulkMenuItems.mockReturnValueOnce([]).mockReturnValueOnce([item]);
    fixture.componentRef.setInput('contextMenuService', contextMenuServiceSpy);
    fixture.detectChanges();

    expect(component.actionMenuItems).toStrictEqual([]);

    component.reload();

    expect(contextMenuServiceSpy.getBulkMenuItems).toHaveBeenCalledTimes(2);
    expect(component.actionMenuItems).toStrictEqual([[item.menuItem]]);
  });
});
