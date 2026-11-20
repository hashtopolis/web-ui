import { ExportMenuComponent } from '@components/menus/export-menu/export-menu.component';
import { ExportMenuAction, ExportMenuLabel } from '@components/menus/export-menu/export-menu.constants';

describe('ExportMenuComponent', () => {
  it('should initialize the export actions in one menu section', () => {
    const component = new ExportMenuComponent();

    component.ngOnInit();

    expect(component.actionMenuItems).toStrictEqual([
      [
        {
          label: ExportMenuLabel.EXCEL,
          action: ExportMenuAction.EXCEL,
          icon: 'file_download'
        },
        {
          label: ExportMenuLabel.CSV,
          action: ExportMenuAction.CSV,
          icon: 'file_download'
        },
        {
          label: ExportMenuLabel.COPY,
          action: ExportMenuAction.COPY,
          icon: 'content_copy'
        }
      ]
    ]);
  });
});
