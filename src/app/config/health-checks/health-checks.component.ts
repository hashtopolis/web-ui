import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { faHomeAlt, faPlus, faEdit, faTrash, faEyeDropper} from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from './../../../environments/environment';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { HealthcheckService } from '../../core/_services/config/healthcheck.service';
import { HashtypeService } from '../../core/_services/config/hashtype.service';
import { CrackerService } from '../../core/_services/config/cracker.service';
import { UIConfigService } from 'src/app/core/_services/shared/storage.service';

@Component({
  selector: 'app-health-checks',
  templateUrl: './health-checks.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class HealthChecksComponent implements OnInit {
  // Loader
  isLoading = false;
  // Form attributtes
  public isCollapsed = true;
  faHome=faHomeAlt;
  faPlus=faPlus;
  faTrash=faTrash;
  faEdit=faEdit;
  faEyeDropper=faEyeDropper;

  // Form create Health Check
  createForm: FormGroup;

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};
  uidateformat:any;

  constructor(
    private healthcheckService: HealthcheckService,
    private hashtypeService: HashtypeService,
    private crackerService: CrackerService,
    private uiService: UIConfigService,
    // private _changeDetectorRef: ChangeDetectorRef,
    private route:ActivatedRoute,
    private router:Router) { }

  crackertype: any = [];
  crackerversions: any = [];

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

  this.createForm = new FormGroup({
    'checkType': new FormControl(0),
    'hashtypeId': new FormControl(null || 0, [Validators.required]),
    'crackerBinaryId': new FormControl('', [Validators.required])
  });

  this.crackerService.getCrackerType().subscribe((crackers: any) => {
    this.crackertype = crackers.values;
  });

  let params = {'maxResults': this.maxResults};

  this.healthcheckService.getHealthChecks(params).subscribe((check: any) => {
    this.hashtypeService.getHashTypes(params).subscribe((hasht: any) => {
    this.mergedObjects = check.values.map(mainObject => {
      let matchObject = hasht.values.find(element => element.hashTypeId === mainObject.hashtypeId)
      return { ...mainObject, ...matchObject }
    })
    this.dtTrigger.next(void 0);
    });
  });

  this.uidateformat = this.uiService.getUIsettings('timefmt').value;

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
              var data = "";
              for (var i = 0; i < dt.length; i++) {
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

  onChangeBinary(id: string){
    let params = {'filter': 'crackerBinaryTypeId='+id+''};
    this.crackerService.getCrackerBinaries(params).subscribe((crackers: any) => {
      this.crackerversions = crackers.values;
    });
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

  onSubmit(){
    if (this.createForm.valid) {
      console.log(this.createForm);

      this.isLoading = true;

      this.healthcheckService.createHealthCheck(this.createForm.value).subscribe((hasht: any) => {
        const response = hasht;
        console.log(response);
        this.isLoading = false;
          Swal.fire({
            title: "Good job!",
            text: "New Health Check created!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          this.isCollapsed = true; //Close button new hashtype
          this.createForm.reset(); // success, we reset form
          this.ngOnInit();
          this.rerender();  // rerender datatables
        },
        errorMessage => {
          // check error status code is 500, if so, do some action
          Swal.fire({
            title: "Error!",
            text: "Health Check was not created, please try again!",
            icon: "warning",
            showConfirmButton: true
          });
        }
      );
    }
  }

  onDelete(id: number){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#4B5563',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    })
    .then((result) => {
      if (result.isConfirmed) {
        this.healthcheckService.deleteHealthCheck(id).subscribe(() => {
          Swal.fire(
            "Health Check has been deleted!",
            {
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          this.ngOnInit();
          this.rerender();  // rerender datatables
        });
      } else {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'No worries, your Health Check Task is safe!',
          'error'
        )
      }
    });
  }

}
