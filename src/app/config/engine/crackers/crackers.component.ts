import { Component, OnInit, OnDestroy } from '@angular/core';
import { faEdit, faTrash, faHomeAlt, faPlus, faEye } from '@fortawesome/free-solid-svg-icons';
import { environment } from './../../../../environments/environment';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { CrackerService } from '../../../core/_services/config/cracker.service';

@Component({
  selector: 'app-crackers',
  templateUrl: './crackers.component.html'
})
export class CrackersComponent implements OnInit, OnDestroy {
  public isCollapsed = true;
  faEdit=faEdit;
  faTrash=faTrash;
  faHome=faHomeAlt;
  faPlus=faPlus;
  faEye=faEye;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  crackerType: any = [];
  constructor(
    private crackerService: CrackerService
    ) { }

  private maxResults = environment.config.prodApiMaxResults

  ngOnInit(): void {
    let params = {'maxResults': this.maxResults, 'expand': 'crackerVersions'}

    this.crackerService.getCrackerType(params).subscribe((type: any) => {
      this.crackerType = type.values;
      this.dtTrigger.next(void 0);
    });
    this.dtOptions = {
      dom: 'Bfrtip',
      pageLength: 10,
      stateSave: true,
      select: true,
      buttons: {
        dom: {
          button: {
            className: 'dt-button buttons-collection btn btn-sm-dt btn-outline-gray-600-dt',
          }
        },
      buttons: [
        {
          extend: 'collection',
          text: 'Export',
          buttons: [
            {
              extend: 'excelHtml5',
              exportOptions: {
                columns: [0, 1, 2]
              },
            },
            {
              extend: 'print',
              exportOptions: {
                columns: [0, 1, 2]
              },
              customize: function ( win ) {
                $(win.document.body)
                    .css( 'font-size', '10pt' )
                $(win.document.body).find( 'table' )
                    .addClass( 'compact' )
                    .css( 'font-size', 'inherit' );
             }
            },
            {
              extend: 'csvHtml5',
              exportOptions: {modifier: {selected: true}},
              select: true,
              customize: function (dt, csv) {
                var data = "";
                for (var i = 0; i < dt.length; i++) {
                  data = "Crackers\n\n"+  dt;
                }
                return data;
             }
            },
              'copy'
            ]
          }
        ],
      }
    };
  }

  onSubmit(){
    Swal.fire({
      title: "Good job!",
      text: "New Cracker created!",
      icon: "success",
      button: "Close",
    });
  }

  onDelete(id: number){
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this cracker!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
      showCancelButton: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        this.crackerService.deleteCrackerType(id).subscribe(() => {
          Swal.fire(
            "File has been deleted!",
            {
            icon: "success",
          });
        });
      } else {
        Swal.fire("Your Cracker is safe!")
      }
    });
  }

}
