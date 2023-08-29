import { environment } from './../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  host: {
    "(window:resize)":"onWindowResize($event)"
  }
})
export class FooterComponent implements OnInit {

  url = '/assets/git-version.json';
  footerConfig = environment.config.footer;
  year = (new Date()).getFullYear();
  gitInfo:any;
  width:number = window.innerWidth;
  height:number = window.innerHeight;

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.http.get(this.url).subscribe(res => {
      this.gitInfo = res;
    });
  }

  onWindowResize(event) {
    this.width = event.target.innerWidth;
    this.height = event.target.innerHeight;
  }

}
