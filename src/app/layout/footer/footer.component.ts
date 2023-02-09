import { Component, OnInit } from '@angular/core';
import { environment } from './../../../environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit {
  footerConfig = environment.config.footer;
  year = (new Date()).getFullYear();
  constructor() { }

  ngOnInit(): void {
  }

}
