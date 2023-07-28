import { Component, Input, OnInit } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-check-mark',
  templateUrl: './check-mark.component.html'
})
export class CheckMarkComponent implements OnInit {

    // This is the option that uses the package's AnimationOption interface
    @Input() options: AnimationOptions = {
      path: '/assets/lottie/check-mark.json'
    };

    constructor() { }

    ngOnInit(): void {  }



}
