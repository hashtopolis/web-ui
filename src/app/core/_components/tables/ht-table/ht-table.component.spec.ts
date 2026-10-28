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
  component['exportActionClicked'] = {
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

  describe('exportAction', () => {
    it('should emit exportActionClicked with selected rows as data', () => {
      const { component, mockSelection } = makeComponent();

      const row1: TestModel = { id: 1, type: 'task', name: 'Task A' };
      const row2: TestModel = { id: 2, type: 'task', name: 'Task B' };
      mockSelection.select(row1, row2);

      const event: ActionMenuEvent<BaseModel> = {
        menuItem: { label: 'Excel', action: 'export-excel' },
        data: { id: 0 } as BaseModel
      };

      component.exportAction(event);

      expect(component['exportActionClicked'].emit).toHaveBeenCalledWith(
        jasmine.objectContaining({
          data: [row1, row2]
        })
      );
    });

    it('should preserve menuItem from original event', () => {
      const { component } = makeComponent();

      const event: ActionMenuEvent<BaseModel> = {
        menuItem: { label: 'CSV', action: 'export-csv' },
        data: { id: 0 } as BaseModel
      };

      component.exportAction(event);

      expect(component['exportActionClicked'].emit).toHaveBeenCalledWith(
        jasmine.objectContaining({
          menuItem: { label: 'CSV', action: 'export-csv' }
        })
      );
    });

    it('should replace dummy data object with actual selected rows', () => {
      const { component, mockSelection } = makeComponent();

      const selectedRow: TestModel = { id: 5, type: 'task', name: 'Real Task' };
      mockSelection.select(selectedRow);

      const dummyData = { id: 0 } as BaseModel;
      const event: ActionMenuEvent<BaseModel> = {
        menuItem: { label: 'Excel', action: 'export-excel' },
        data: dummyData
      };

      component.exportAction(event);

      const emittedEvent = (component['exportActionClicked'].emit as jasmine.Spy).calls.mostRecent().args[0];
      expect(emittedEvent.data).not.toBe(dummyData);
      expect(emittedEvent.data).toEqual([selectedRow]);
    });

    it('should emit empty array when no rows are selected', () => {
      const { component } = makeComponent();

      const event: ActionMenuEvent<BaseModel> = {
        menuItem: { label: 'Excel', action: 'export-excel' },
        data: { id: 0 } as BaseModel
      };

      component.exportAction(event);

      expect(component['exportActionClicked'].emit).toHaveBeenCalledWith(
        jasmine.objectContaining({
          data: []
        })
      );
    });

    it('should emit data as an iterable array (regression: rawData is not iterable)', () => {
      const { component, mockSelection } = makeComponent();

      const row: TestModel = { id: 7, type: 'task', name: 'Iterable Task' };
      mockSelection.select(row);

      const event: ActionMenuEvent<BaseModel> = {
        menuItem: { label: 'Excel', action: 'export-excel' },
        data: { id: 0 } as BaseModel
      };

      component.exportAction(event);

      const emittedEvent = (component['exportActionClicked'].emit as jasmine.Spy).calls.mostRecent().args[0];
      expect(Array.isArray(emittedEvent.data)).toBe(true);
      expect(() => {
        for (const _ of emittedEvent.data) {
          /* iteration must not throw */
        }
      }).not.toThrow();
    });

    it('should emit the same selected rows as bulkAction (parity)', () => {
      const { component, mockSelection } = makeComponent();

      const row1: TestModel = { id: 11, type: 'task', name: 'Shared A' };
      const row2: TestModel = { id: 12, type: 'task', name: 'Shared B' };
      mockSelection.select(row1, row2);

      const bulkEvent: ActionMenuEvent<BaseModel> = {
        menuItem: { label: 'Delete', action: 'delete' },
        data: { id: 0 } as BaseModel
      };
      const exportEvent: ActionMenuEvent<BaseModel> = {
        menuItem: { label: 'Excel', action: 'export-excel' },
        data: { id: 0 } as BaseModel
      };

      component.bulkAction(bulkEvent);
      component.exportAction(exportEvent);

      const bulkData = (component['bulkActionClicked'].emit as jasmine.Spy).calls.mostRecent().args[0].data;
      const exportData = (component['exportActionClicked'].emit as jasmine.Spy).calls.mostRecent().args[0].data;
      expect(exportData).toEqual(bulkData);
    });

    it('should emit the current selection, not a stale snapshot', () => {
      const { component, mockSelection } = makeComponent();

      const initialRow: TestModel = { id: 21, type: 'task', name: 'Initial' };
      mockSelection.select(initialRow);

      const event: ActionMenuEvent<BaseModel> = {
        menuItem: { label: 'Excel', action: 'export-excel' },
        data: { id: 0 } as BaseModel
      };
      component.exportAction(event);

      const newRow: TestModel = { id: 22, type: 'task', name: 'Added Later' };
      mockSelection.select(newRow);
      component.exportAction(event);

      const emitSpy = component['exportActionClicked'].emit as jasmine.Spy;
      expect(emitSpy.calls.argsFor(0)[0].data).toEqual([initialRow]);
      expect(emitSpy.calls.argsFor(1)[0].data).toEqual([initialRow, newRow]);
    });

    it('should not mutate the original event object', () => {
      const { component, mockSelection } = makeComponent();

      const selectedRow: TestModel = { id: 31, type: 'task', name: 'Selected' };
      mockSelection.select(selectedRow);

      const originalData = { id: 0 } as BaseModel;
      const originalMenuItem = { label: 'Excel', action: 'export-excel' };
      const event: ActionMenuEvent<BaseModel> = {
        menuItem: originalMenuItem,
        data: originalData
      };

      component.exportAction(event);

      expect(event.data).toBe(originalData);
      expect(event.menuItem).toBe(originalMenuItem);
    });
  });

  describe('copyCellValue', () => {
    const row: TestModel = { id: 1, type: 'task', name: 'Task A' };
    const copy = { label: 'Task name', value: (data: BaseModel) => (data as TestModel).name };

    function makeCopyComponent(copied: boolean) {
      const { component } = makeComponent();
      const clipboard = jasmine.createSpyObj('Clipboard', ['copy']);
      clipboard.copy.and.returnValue(copied);
      const alertService = jasmine.createSpyObj('AlertService', ['showSuccessMessage', 'showErrorMessage']);
      const focusMonitor = jasmine.createSpyObj('FocusMonitor', ['focusVia']);
      component['clipboard'] = clipboard;
      component['alertService'] = alertService;
      component['focusMonitor'] = focusMonitor;
      return { component, clipboard, alertService, focusMonitor };
    }

    /** Click event on a copy button; screen coordinates of 0 mean the click was triggered via keyboard */
    function clickOn(button: HTMLElement, screenX = 100, screenY = 100): MouseEvent {
      const event = new MouseEvent('click', { screenX, screenY });
      Object.defineProperty(event, 'currentTarget', { value: button });
      return event;
    }

    it('should copy the configured value and show a success message', () => {
      const { component, clipboard, alertService } = makeCopyComponent(true);

      component.copyCellValue(copy, row, clickOn(document.createElement('button')));

      expect(clipboard.copy).toHaveBeenCalledOnceWith('Task A');
      expect(alertService.showSuccessMessage).toHaveBeenCalledOnceWith('Task name successfully copied to clipboard.');
      expect(alertService.showErrorMessage).not.toHaveBeenCalled();
    });

    it('should show an error message when copying fails', () => {
      const { component, alertService } = makeCopyComponent(false);

      component.copyCellValue(copy, row, clickOn(document.createElement('button')));

      expect(alertService.showErrorMessage).toHaveBeenCalledOnceWith('Could not copy task name to clipboard.');
      expect(alertService.showSuccessMessage).not.toHaveBeenCalled();
    });

    it('should attribute the refocused button to the mouse after a mouse click', () => {
      const { component, focusMonitor } = makeCopyComponent(true);
      const button = document.createElement('button');

      component.copyCellValue(copy, row, clickOn(button));

      expect(focusMonitor.focusVia).toHaveBeenCalledOnceWith(button, 'mouse');
    });

    it('should attribute the refocused button to the keyboard after a keyboard activation', () => {
      const { component, focusMonitor } = makeCopyComponent(true);
      const button = document.createElement('button');

      component.copyCellValue(copy, row, clickOn(button, 0, 0));

      expect(focusMonitor.focusVia).toHaveBeenCalledOnceWith(button, 'keyboard');
    });
  });
});
