import {
  faArchive,
  faBookmark,
  faCopy,
  faEdit,
  faFileExport,
  faFileImport,
  faHomeAlt,
  faLock,
  faPlus,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { environment } from './../../../environments/environment';
import { DataTableDirective } from 'angular-datatables';
import { Subject, Subscription } from 'rxjs';

import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { AlertService } from 'src/app/core/_services/shared/alert.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { SERV } from '../../core/_services/main.config';

declare let $: any;

@Component({
  selector: 'app-preconfigured-tasks',
  templateUrl: './preconfigured-tasks.component.html'
})
/**
 * PreconfiguredTasksComponent is a component that manages and displays preconfigured tasks data.
 *
 */
export class PreconfiguredTasksComponent {
  constructor(private titleService: AutoTitleService) {
    titleService.set(['Show Preconfigured Task']);
  }
}
