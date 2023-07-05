import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { CrackerService } from 'src/app/core/_services/config/cracker.service';

@Component({
  selector: 'app-new-cracker',
  templateUrl: './new-cracker.component.html'
})
@PageTitle(['New Cracker'])
export class NewCrackerComponent implements OnInit {

  constructor(
    private crackerService: CrackerService
  ) { }

  ngOnInit(): void {
  }

  onSubmit(){
    Swal.fire({
      title: "Success",
      text: "New Cracker created!",
      icon: "success",
      button: "Close",
    });
  }


}
