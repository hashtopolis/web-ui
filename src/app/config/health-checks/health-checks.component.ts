import { faHomeAlt, faPlus, faEdit, faTrash, faEyeDropper} from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit, ViewChild} from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { UIConfigService } from 'src/app/core/_services/shared/storage.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { environment } from './../../../environments/environment';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../core/_services/main.config';

@Component({
  selector: 'app-health-checks',
  templateUrl: './health-checks.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
@PageTitle(['Show Health Checks'])
export class HealthChecksComponent implements OnInit {
  // Loader
  isLoading = false;
  // Form attributtes
  faHome=faHomeAlt;
  faPlus=faPlus;
  faTrash=faTrash;
  faEdit=faEdit;
  faEyeDropper=faEyeDropper;

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};
  uidateformat:any;

  constructor(
    private uiService: UIConfigService,
    private gs: GlobalService,
  ) { }

  public healthc: {
    attackCmd: string,
    checkType: number,
    crackerBinaryId: number,
    expectedCracks: number,
    hashtypeId: number,
    hashtypeName: string,
    healthCheckId: number,
    status: number,
    time: number
  }[] = [];

  public htypes: {
    hashTypeId: number,
    description: string,
    isSalted: number,
    isSlowHash: number,
   }[] = [];

  private maxResults = environment.config.prodApiMaxResults;

  public mergedObjects: any

  ngOnInit(): void {

  const params = {'maxResults': this.maxResults};

  this.gs.getAll(SERV.HEALTH_CHECKS,params).subscribe((check: any) => {
    this.gs.getAll(SERV.HASHTYPES,params).subscribe((hasht: any) => {
    this.mergedObjects = check.values.map(mainObject => {
      const matchObject = hasht.values.find(element => element.hashTypeId === mainObject.hashtypeId)
      return { ...mainObject, ...matchObject }
    })
    this.dtTrigger.next(void 0);
    });
  });

  this.uidateformat = this.uiService.getUIsettings('timefmt').value;
  const self = this;
  this.dtOptions = {
    dom: 'Bfrtip',
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
        text: '↻',
        autoClose: true,
        action: function (e, dt, node, config) {
          self.onRefresh();
        }
      },
      {
        extend: 'collection',
        text: 'Export',
        buttons: [
          {
            extend: 'excelHtml5',
            exportOptions: {
              columns: [0, 1, 2, 3]
            },
          },
          {
            extend: 'print',
            exportOptions: {
              columns: [0, 1, 2, 3]
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
              let data = "";
              for (let i = 0; i < dt.length; i++) {
                data = "Health Checks\n\n"+  dt;
              }
              return data;
           }
          },
            'copy'
          ]
        },
        {
          extend: "pageLength",
          className: "btn-sm"
        }
      ],
    }
  };

  }

  onRefresh(){
    this.rerender();
    this.ngOnInit();
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
        this.gs.delete(SERV.HEALTH_CHECKS,id).subscribe(() => {
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
          text: "Your Health Check is safe!",
          icon: "error",
          showConfirmButton: false,
          timer: 1500
        })
      }
    });
  }

}
