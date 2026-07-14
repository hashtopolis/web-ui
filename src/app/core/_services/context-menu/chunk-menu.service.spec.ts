import { JChunk } from '@models/chunk.model';

import { ChunkContextMenuService } from '@services/context-menu/chunk-menu.service';
import { PermissionService } from '@services/permission/permission.service';

import { RowActionMenuComponent } from '@components/menus/row-action-menu/row-action-menu.component';
import { RowActionMenuLabel } from '@components/menus/row-action-menu/row-action-menu.constants';

describe('ChunkContextMenuService', () => {
  let contextMenuService: ChunkContextMenuService;
  let permissionServiceSpy: jasmine.SpyObj<PermissionService>;

  const buildChunk = (isRunning: boolean): JChunk =>
    ({
      id: 1,
      type: 'chunk',
      taskId: 1,
      skip: 0,
      length: 100,
      agentId: 1,
      dispatchTime: 0,
      solveTime: 0,
      checkpoint: 0,
      progress: 0,
      state: isRunning ? 2 : 0,
      isRunning,
      cracked: 0,
      speed: 0
    }) as JChunk;

  /** Runs the same label-selection logic the real row action menu uses for a given chunk. */
  const getVisibleLabels = (chunk: JChunk): string[] => {
    const menu = new RowActionMenuComponent();
    menu.contextMenuService = contextMenuService;
    menu.data = chunk;
    menu.ngOnInit();
    return menu.actionMenuItems.flat().map((item) => item.label);
  };

  beforeEach(() => {
    permissionServiceSpy = jasmine.createSpyObj('PermissionService', ['hasAllPermissionsSync']);
    permissionServiceSpy.hasAllPermissionsSync.and.returnValue(true);
    contextMenuService = new ChunkContextMenuService(permissionServiceSpy).addContextMenu();
  });

  it('shows "Reset Task Chunk" and not "Abort Task Chunk" when the chunk is not running', () => {
    const labels = getVisibleLabels(buildChunk(false));

    expect(labels).toContain(RowActionMenuLabel.RESET_CHUNK);
    expect(labels).not.toContain(RowActionMenuLabel.ABORT_CHUNK);
  });

  it('shows "Abort Task Chunk" and not "Reset Task Chunk" when the chunk is running', () => {
    const labels = getVisibleLabels(buildChunk(true));

    expect(labels).toContain(RowActionMenuLabel.ABORT_CHUNK);
    expect(labels).not.toContain(RowActionMenuLabel.RESET_CHUNK);
  });
});
