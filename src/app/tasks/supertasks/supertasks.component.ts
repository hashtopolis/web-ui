import { faEdit, faTrash, faPlus, faAdd } from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

import { SuperTasksService } from '../../core/_services/tasks/supertasks.sevice';
import { environment } from './../../../environments/environment';
import { PageTitle } from 'src/app/core/_decorators/autotitle';

// declare var $: any;
@Component({
  selector: 'app-supertasks',
  templateUrl: './supertasks.component.html'
})
@PageTitle(['Show SuperTasks'])
export class SupertasksComponent implements OnInit {

  // Title Page
  pTitle = "Supertasks";
  buttontitle = "New Supertasks";
  buttonlink = "/tasks/new-supertasks";
  subbutton = true;


  faEdit=faEdit;
  faTrash=faTrash;
  faPlus=faPlus;
  faAdd=faAdd;

  allsupertasks: any = [];

  constructor(
    private supertaskService: SuperTasksService,
    private route:ActivatedRoute
  ) { }

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  private maxResults = environment.config.prodApiMaxResults

  ngOnInit(): void {
    let params = {'maxResults': this.maxResults }

    this.supertaskService.getAllsupertasks(params).subscribe((stasks: any) => {
      this.allsupertasks = stasks.values;
      this.dtTrigger.next(void 0);
    });

    this.dtOptions = {
      dom: 'Qlfrtip',
      pageLength: 10,
      stateSave: true,
      responsive: true,
      buttons: []
    };

  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      setTimeout(() => {
        this.dtTrigger['new'].next();
      });
    });
  }

  onDelete(id: number){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn',
        cancelButton: 'btn'
      },
      buttonsStyling: false
    })
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, it can not be recovered!",
      icon: "warning",
      reverseButtons: true,
      showCancelButton: true,
      cancelButtonColor: '#8A8584',
      confirmButtonColor: '#C53819',
      confirmButtonText: 'Yes, delete it!'
    })
    .then((result) => {
      if (result.isConfirmed) {
        this.supertaskService.deleteSupertask(id).subscribe(() => {
          Swal.fire({
            title: "Success",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          this.ngOnInit();
          this.rerender();  // rerender datatables
        });
      } else {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Your SuperTask is safe!",
          icon: "error",
          showConfirmButton: false,
          timer: 1500
        })
      }
    });
  }

}
