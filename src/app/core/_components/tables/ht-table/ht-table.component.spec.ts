/// <reference types="jasmine" />
import { SelectionModel } from '@angular/cdk/collections';

import { BaseModel } from '@models/base.model';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';

import { HTTableComponent } from './ht-table.component';
import { BaseDataSource } from '@datasources/base.datasource';

interface TestModel extends BaseModel {
  name: string;
}

function makeComponent() {
  const component = Object.create(HTTableComponent.prototype) as HTTableComponent<TestModel>;

  const selectedRows: TestModel[] = [];
  const mockSelection = new SelectionModel<TestModel>(true, selectedRows);

  const mockDataSource = {
    selection: mockSelection
  } as unknown as BaseDataSource<TestModel>;

  component['dataSource'] = mockDataSource;
  component['bulkActionClicked'] = {
    emit: jasmine.createSpy('emit')
  } as never;

  return { component, mockSelection };
}

describe('HTTableComponent', () => {
  describe('bulkAction', () => {
    it('should emit bulkActionClicked with selected rows as data', () => {
      const { component, mockSelection } = makeComponent();

      const row1: TestModel = { id: 1, type: 'task', name: 'Task A' };
      const row2: TestModel = { id: 2, type: 'task', name: 'Task B' };
      mockSelection.select(row1, row2);

      const event: ActionMenuEvent<BaseModel> = {
        menuItem: { label: 'Delete', action: 'delete' },
        data: { id: 0 } as BaseModel
      };

      component.bulkAction(event);

      expect(component['bulkActionClicked'].emit).toHaveBeenCalledWith(
        jasmine.objectContaining({
          data: [row1, row2]
        })
      );
    });

    it('should preserve menuItem from original event', () => {
      const { component } = makeComponent();

      const event: ActionMenuEvent<BaseModel> = {
        menuItem: { label: 'Archive', action: 'archive' },
        data: { id: 0 } as BaseModel
      };

      component.bulkAction(event);

      expect(component['bulkActionClicked'].emit).toHaveBeenCalledWith(
        jasmine.objectContaining({
          menuItem: { label: 'Archive', action: 'archive' }
        })
      );
    });

    it('should replace dummy data object with actual selected rows', () => {
      const { component, mockSelection } = makeComponent();

      const selectedRow: TestModel = { id: 5, type: 'task', name: 'Real Task' };
      mockSelection.select(selectedRow);

      const dummyData = { id: 0 } as BaseModel;
      const event: ActionMenuEvent<BaseModel> = {
        menuItem: { label: 'Delete', action: 'delete' },
        data: dummyData
      };

      component.bulkAction(event);

      const emittedEvent = (component['bulkActionClicked'].emit as jasmine.Spy).calls.mostRecent().args[0];
      expect(emittedEvent.data).not.toBe(dummyData);
      expect(emittedEvent.data).toEqual([selectedRow]);
    });

    it('should emit empty array when no rows are selected', () => {
      const { component } = makeComponent();

      const event: ActionMenuEvent<BaseModel> = {
        menuItem: { label: 'Delete', action: 'delete' },
        data: { id: 0 } as BaseModel
      };

      component.bulkAction(event);

      expect(component['bulkActionClicked'].emit).toHaveBeenCalledWith(
        jasmine.objectContaining({
          data: []
        })
      );
    });
  });
});
