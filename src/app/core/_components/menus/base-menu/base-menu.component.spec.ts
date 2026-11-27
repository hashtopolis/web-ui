import type { BaseModel } from '@models/base.model';

import type { ContextMenuType } from '@services/context-menu/base/context-menu.service';

import type { ActionMenuEvent, ActionMenuItem } from '@components/menus/action-menu/action-menu.model';
import { BaseMenuComponent } from '@components/menus/base-menu/base-menu.component';

interface MenuData extends BaseModel {
  active: boolean;
  tags: string[];
}

class TestBaseMenuComponent extends BaseMenuComponent<MenuData> {
  addItem(index: number, item: ActionMenuItem): void {
    this.addActionMenuItem(index, item);
  }

  addItemWhenConditionMatches(item: ContextMenuType, data: MenuData): void {
    this.conditionallyAddMenuItem(item, data);
  }
}

describe('BaseMenuComponent', () => {
  let component: TestBaseMenuComponent;

  const menuData: MenuData = {
    id: 1,
    type: 'test',
    active: true,
    tags: ['tag']
  };

  beforeEach(() => {
    component = new TestBaseMenuComponent();
  });

  describe('addActionMenuItem', () => {
    it('should create a menu section and append items to an existing section', () => {
      const firstItem: ActionMenuItem = { label: 'First' };
      const secondItem: ActionMenuItem = { label: 'Second' };

      component.addItem(1, firstItem);
      component.addItem(1, secondItem);

      expect(component.actionMenuItems[1]).toStrictEqual([firstItem, secondItem]);
    });
  });

  describe('conditionallyAddMenuItem', () => {
    it('should add items when there is no condition or its key is empty', () => {
      const withoutCondition: ContextMenuType = {
        index: 0,
        menuItem: { label: 'Unconditional' }
      };
      const emptyKeyCondition: ContextMenuType = {
        index: 1,
        menuItem: { label: 'Empty key' },
        condition: { key: '', value: true }
      };

      component.addItemWhenConditionMatches(withoutCondition, menuData);
      component.addItemWhenConditionMatches(emptyKeyCondition, menuData);

      expect(component.actionMenuItems[0]).toStrictEqual([withoutCondition.menuItem]);
      expect(component.actionMenuItems[1]).toStrictEqual([emptyKeyCondition.menuItem]);
    });

    it('should add items when a scalar value matches the condition', () => {
      const matching: ContextMenuType = {
        index: 0,
        menuItem: { label: 'Active' },
        condition: { key: 'active', value: true }
      };
      const mismatching: ContextMenuType = {
        index: 0,
        menuItem: { label: 'Inactive' },
        condition: { key: 'active', value: false }
      };

      component.addItemWhenConditionMatches(matching, menuData);
      component.addItemWhenConditionMatches(mismatching, menuData);

      expect(component.actionMenuItems[0]).toStrictEqual([matching.menuItem]);
    });

    it('should match array conditions based on whether the array is empty', () => {
      const nonEmptyMatches: ContextMenuType = {
        index: 0,
        menuItem: { label: 'Has tags' },
        condition: { key: 'tags', value: true }
      };
      const emptyMatches: ContextMenuType = {
        index: 1,
        menuItem: { label: 'No tags' },
        condition: { key: 'tags', value: false }
      };
      const nonEmptyMismatches: ContextMenuType = {
        index: 2,
        menuItem: { label: 'No tags' },
        condition: { key: 'tags', value: false }
      };
      const emptyMismatches: ContextMenuType = {
        index: 3,
        menuItem: { label: 'Has tags' },
        condition: { key: 'tags', value: true }
      };

      component.addItemWhenConditionMatches(nonEmptyMatches, menuData);
      component.addItemWhenConditionMatches(emptyMatches, { ...menuData, tags: [] });
      component.addItemWhenConditionMatches(nonEmptyMismatches, menuData);
      component.addItemWhenConditionMatches(emptyMismatches, { ...menuData, tags: [] });

      expect(component.actionMenuItems[0]).toStrictEqual([nonEmptyMatches.menuItem]);
      expect(component.actionMenuItems[1]).toStrictEqual([emptyMatches.menuItem]);
      expect(component.actionMenuItems[2]).toBeUndefined();
      expect(component.actionMenuItems[3]).toBeUndefined();
    });
  });

  describe('onMenuItemClick', () => {
    it('should emit the received menu event, including when its data is undefined', () => {
      const event: ActionMenuEvent<MenuData | undefined> = {
        menuItem: { label: 'Action' },
        data: undefined
      };
      const listener = vi.fn().mockName('menuItemClicked listener');
      component.menuItemClicked.subscribe(listener);

      component.onMenuItemClick(event);

      expect(listener).toHaveBeenCalledExactlyOnceWith(event);
    });
  });
});
