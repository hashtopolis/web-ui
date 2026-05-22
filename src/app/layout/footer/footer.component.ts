import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';

import { environment } from '@src/environments/environment';

interface GitVersion {
  shortSHA: string;
  SHA: string;
  branch: string;
  lastCommitTime: string;
  lastCommitMessage: string;
  lastCommitNumber: string;
}

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  standalone: false
})
export class FooterComponent implements OnInit {
  url = '/assets/git-version.json';
  footerConfig = environment.config.footer;
  year = new Date().getFullYear();
  gitInfo: GitVersion;

  private http = inject(HttpClient);

  ngOnInit(): void {
    this.http.get<GitVersion>(this.url).subscribe((res) => {
      this.gitInfo = res;
    });
  }
}
