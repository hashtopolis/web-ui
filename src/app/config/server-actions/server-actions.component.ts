import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';

import { JHelper, RebuildChunkCacheMeta, RescanGlobalFilesMeta } from '@models/helper.model';

import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';
import { UnsubscribeService } from '@services/unsubscribe.service';

@Component({
  selector: 'app-server-actions',
  imports: [MatButton],
  templateUrl: './server-actions.component.html',
  styleUrl: './server-actions.component.scss'
})
export class ServerActionsComponent {
  constructor(
    private unsubscribeService: UnsubscribeService,
    private gs: GlobalService,
    private alert: AlertService
  ) {}

  /**
   * Initiates the process to rebuild the chunk cache on the server.
   * Displays a success message with details if the operation is successful,
   * otherwise shows an error message.
   */
  rebuildChunkCache(): void {
    const sub$ = this.gs.chelper(SERV.HELPER, 'rebuildChunkCache').subscribe((res: JHelper) => {
      const meta = res?.meta as RebuildChunkCacheMeta;

      if (meta && String(meta.Rebuild).toLowerCase() === 'success') {
        const correctedChunks = meta.correctedChunks;
        const correctedHashlists = meta.correctedHashlists;

        this.alert.showSuccessMessage(
          `Updated all chunks and hashlists. Corrected ${correctedChunks} chunks and ${correctedHashlists} hashlists.`
        );
      } else {
        this.alert.showErrorMessage('Error while executing rebuild chunk cache');
      }
    });

    this.unsubscribeService.add(sub$);
  }

  /**
   * Initiates the process to rescan global files on the server.
   * Displays a success message if the operation is successful,
   * otherwise shows an error message.
   */
  rescanGlobalFiles(): void {
    const sub$ = this.gs.chelper(SERV.HELPER, 'rescanGlobalFiles').subscribe((res: JHelper) => {
      const meta = res?.meta as RescanGlobalFilesMeta;

      if (meta && String(meta.Rescan).toLowerCase() === 'success') {
        this.alert.showSuccessMessage(`File scan was successful, no actions required!`);
      } else {
        this.alert.showErrorMessage('Error while executing rescan global files');
      }
    });

    this.unsubscribeService.add(sub$);
  }
}
