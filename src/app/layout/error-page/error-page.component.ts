import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  standalone: false
})
export class ErrorPageComponent implements OnInit {
  private route = inject(ActivatedRoute);

  errorMessage: string;

  ngOnInit() {
    this.route.data.subscribe((data: Data) => {
      this.errorMessage = data['message'];
    });
  }
}
