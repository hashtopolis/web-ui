import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ApiKeyRevealStore } from '@services/api-key-reveal.store';
import { ApiTokensRoleService } from '@services/roles/user/api-tokens-role.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

import {
  RevealApiKeyDialogComponent,
  RevealApiKeyDialogData
} from '@src/app/account/api-keys/reveal-api-key/reveal-api-key.component';

@Component({
  selector: 'app-api-keys',
  templateUrl: './api-keys.component.html',
  standalone: false
})
export class ApiKeysComponent implements OnInit {
  private roleService = inject(ApiTokensRoleService);
  private titleService = inject(AutoTitleService);
  private revealStore = inject(ApiKeyRevealStore);
  private dialog = inject(MatDialog);

  protected showCreateButton = this.roleService.hasRole('create');

  constructor() {
    this.titleService.set(['API Keys']);
  }

  ngOnInit(): void {
    // When we navigate here after creating a key (which is put in the store)
    // show the dialog with the key, is a bit nicer to show it here in the list than on the create screen
    const token = this.revealStore.consume();
    if (token) {
      this.dialog.open<RevealApiKeyDialogComponent, RevealApiKeyDialogData>(RevealApiKeyDialogComponent, {
        data: { token },
        width: '720px',
        disableClose: true
      });
    }
  }
}
