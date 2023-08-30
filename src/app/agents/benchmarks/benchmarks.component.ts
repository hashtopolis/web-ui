import { faRefresh, faPauseCircle, faEdit, faTrash, faLock, faFileImport, faFileExport, faPlus, faHomeAlt, faArchive, faCopy, faBookmark, faEye } from '@fortawesome/free-solid-svg-icons';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { environment } from './../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { interval, Subject, Subscription } from 'rxjs';
import { UIConfigService } from 'src/app/core/_services/shared/storage.service';


import { CookieService } from 'src/app/core/_services/shared/cookies.service';
import { ChunkService } from 'src/app/core/_services/tasks/chunks.service';
import { UsersService } from 'src/app/core/_services/users/users.service';
import { TasksService } from '../../core/_services/tasks/tasks.sevice';

import { BenchmarkService } from 'src/app/core/_services/agents/benchmark.service';

@Component({
    selector: 'app-benchmark',
    templateUrl: './benchmarks.component.html'
  })

  export class BenchmarkComponent implements OnInit {
    faPauseCircle=faPauseCircle;
    faFileImport=faFileImport;
    faFileExport=faFileExport;
    faBookmark=faBookmark;
    faArchive=faArchive;
    faRefresh=faRefresh;
    faHome=faHomeAlt;
    faTrash=faTrash;
    faEdit=faEdit;
    faLock=faLock;
    faPlus=faPlus;
    faCopy=faCopy;
    faEye=faEye;
  
    storedAutorefresh: any =[]
  
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
  
    dtTrigger: Subject<any> = new Subject<any>();
    dtOptions: any = {};

    benchmarks: any = []; //Change to Interface

    uidateformat:any;

    isChecked:boolean =false;
    private maxResults = environment.config.prodApiMaxResults

    constructor(
      private benchmarkService: BenchmarkService,
      private route: ActivatedRoute,
      private users: UsersService,
      private uiService: UIConfigService,
      ) { }

    ngOnInit(): void {

      this.getBenchmarks();
      this.setAccessPermissions();

      this.uidateformat = this.uiService.getUIsettings('timefmt').value;
  
      this.dtOptions = {
        dom: 'Bfrtip',
        scrollY: true,
        bDestroy: true,
        columnDefs: [
          {
              targets: 0,
              className: 'noVis'
          }
        ],
        order: [[0, 'desc']],
        bStateSave:true,
        select: {
          style: 'multi',
          },
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
                    columns: [0, 1, 2, 3, 4]
                  },
                },
                {
                  extend: 'print',
                  exportOptions: {
                    columns: [0, 1, 2, 3, 4]
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
                      data = "Benchmark\n\n"+  dt;
                    }
                    return data;
                 }
                },
                  'copy'
                ]
              },
              {
                extend: 'colvis',
                text: 'Column View',
                columns: [ 1,2,3,4,5,6 ],
              },
              {
                extend: "pageLength",
                className: "btn-sm"
              },
            ],
          }
        }
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

    getBenchmarks():void {
      let params = {'maxResults': this.maxResults, 'expand': 'crackerBinary,hardwareGroup'}
      this.benchmarks = [];

      this.benchmarkService.getAllbenchmarks(params).subscribe((benchmarks: any) => {
        this.benchmarks = benchmarks.values;
        this.dtTrigger.next(void 0);
      });
    }

    setCheckAll(){
      let chkBoxlength = $(".checkboxCls:checked").length;
      if (this.isChecked == true) {
        $(".checkboxCls").prop("checked", false);
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.rows(  ).deselect();
          this.isChecked = false;
        });
      } else {
        $(".checkboxCls").prop("checked", true);
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.rows(  ).select();
          this.isChecked = true;
        });
      }
    }

  // Set permissions
  manageBenchmarkAccess: any;

  setAccessPermissions(){
    this.users.getUser(this.users.userId,{'expand':'globalPermissionGroup'}).subscribe((perm: any) => {
      this.manageBenchmarkAccess = perm.globalPermissionGroup.permissions.manageTaskAccess;
    });
  }

    onDelete(id: number){
      if(this.manageBenchmarkAccess || typeof this.manageBenchmarkAccess == 'undefined'){
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })
      Swal.fire({
        title: "Are you sure?",
        text: "Once deleted, it can not be recovered!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: '#4B5563',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.benchmarkService.deleteBenchmark(id).subscribe(() => {
            Swal.fire(
              "Benchmark has been deleted!",
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
            'No worries, your Task is safe!',
            'error'
          )
        }
      });
      }else{
        Swal.fire({
          title: "ACTION DENIED",
          text: "Please contact your Administrator.",
          icon: "error",
          showConfirmButton: false,
          timer: 2000
        })
      }
    }

  }
