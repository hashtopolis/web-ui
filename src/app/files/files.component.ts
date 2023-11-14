import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { AutoTitleService } from '../core/_services/shared/autotitle.service';
import { FileType } from '../core/_models/file.model';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html'
})
export class FilesComponent implements OnInit {
  fileType: FileType = 0;
  FileType = FileType;

  constructor(
    private route: ActivatedRoute,
    private titleService: AutoTitleService
  ) {
    titleService.set(['Show Files']);
  }

  ngOnInit(): void {
    this.loadFiles();
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
