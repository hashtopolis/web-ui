import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

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
  host: {
    '(window:resize)': 'onWindowResize($event)'
  },
  standalone: false
})
export class FooterComponent implements OnInit {
  url = '/assets/git-version.json';
  footerConfig = environment.config.footer;
  year = new Date().getFullYear();
  gitInfo: GitVersion;
  width: number = window.innerWidth;
  height: number = window.innerHeight;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<GitVersion>(this.url).subscribe((res) => {
      this.gitInfo = res;
    });
  }

  onWindowResize(event: Event) {
    const target = event.target as Window;
    this.width = target.innerWidth;
    this.height = target.innerHeight;
  }
}
