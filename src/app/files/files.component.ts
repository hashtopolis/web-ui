import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { AutoTitleService } from '../core/_services/shared/autotitle.service';
import { FileType } from '../core/_models/file.model';

@Component({
    selector: 'app-files',
    templateUrl: './files.component.html',
    standalone: false
})
export class FilesComponent implements OnInit {
  fileType: FileType = 0;
  FileType = FileType;
  name = "filesTable";

  constructor(
    private route: ActivatedRoute,
    private titleService: AutoTitleService
  ) {
    titleService.set(['Show Files']);
  }

  ngOnInit(): void {
    this.loadFiles();
    switch (this.fileType) {
      case 0:
        this.name = "filesWordlistTable";
        break;
      case 1:
        this.name = "filesRuleTable";
        break;
      case 2:
        this.name = "filesOtherTable";
        break
    }
  }

  loadFiles() {
    this.route.data.subscribe((data) => {
      switch (data['kind']) {
        case 'wordlist':
          this.fileType = FileType.WORDLIST;
          break;

        case 'rules':
          this.fileType = FileType.RULES;
          break;

        case 'other':
          this.fileType = FileType.OTHER;
          break;
      }
    });
  }
}
