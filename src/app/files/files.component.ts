import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TableSettingsKey } from '@models/config-ui.model';
import { FileType } from '@models/file.model';
import { FilesRouteKind, zFilesRouteData } from '@models/routes.schema';

import { FileRoleService } from '@services/roles/file-role.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  standalone: false
})
export class FilesComponent implements OnInit {
  fileType: FileType = 0;
  FileType = FileType;
  name: TableSettingsKey = 'filesTable';

  protected showCreateButton: boolean = false;

  private route = inject(ActivatedRoute);
  private titleService = inject(AutoTitleService);
  private fileRolesService = inject(FileRoleService);

  constructor() {
    this.titleService.set(['Show Files']);
  }

  ngOnInit(): void {
    this.loadFiles();
    this.showCreateButton = this.fileRolesService.hasRole('create');
    switch (this.fileType) {
      case 0:
        this.name = 'filesWordlistTable';
        break;
      case 1:
        this.name = 'filesRuleTable';
        break;
      case 2:
        this.name = 'filesOtherTable';
        break;
    }
  }

  loadFiles() {
    this.route.data.subscribe((data) => {
      const routeDataKind = zFilesRouteData.parse(data).kind;
      switch (routeDataKind) {
        case FilesRouteKind.Wordlist:
          this.fileType = FileType.WORDLIST;
          break;

        case FilesRouteKind.Rules:
          this.fileType = FileType.RULES;
          break;

        case FilesRouteKind.Other:
          this.fileType = FileType.OTHER;
          break;
      }
    });
  }
}
