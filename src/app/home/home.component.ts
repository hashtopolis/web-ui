import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  title = 'Hastopolis';
  username: string = 'Admin';

  getUsername(){
      return this.username;
  }

  ngOnInit(): void {

  }

}
