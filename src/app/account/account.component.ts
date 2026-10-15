import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class AccountComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
