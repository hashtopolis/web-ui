import { faEdit, faTrash, faPlus, faLock} from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { GlobalService } from 'src/app/core/_services/main.service';
import { environment } from './../../environments/environment';
import { PageTitle } from '../core/_decorators/autotitle';
import { SERV } from '../core/_services/main.config';
import { Filetype } from '../core/_models/files';

declare let $:any;

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html'
})
@PageTitle(['Show Files'])
export class FilesComponent implements OnInit {

  faTrash=faTrash;
  faPlus=faPlus;
  faLock=faLock;
  faEdit=faEdit;

  public allfiles: {
    fileId: number,
    filename: string,
    size: number,
    isSecret: boolean,
    fileType: number,
    accessGroupId: number,
    lineCount:number
    accessGroup: {
      accessGroupId: number,
      groupName: string
    }
  }[] = [];

  private maxResults = environment.config.prodApiMaxResults;

  constructor(
    private route:ActivatedRoute,
    private gs: GlobalService,
    private router:Router
    ) { }

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  ngOnDestroy(){
    this.dtTrigger.unsubscribe();
  }

  filterType: number
  whichView: string;
  navEdit: string;

  ngOnInit(): void {

    this.loadFiles();

  }

  loadFiles(){
    this.route.data.subscribe(data => {
      switch (data['kind']) {

        case 'wordlist':
          this.filterType = 0;
          this.whichView = 'wordlist';
          this.navEdit = 'wordlist-edit';
        break;

        case 'rules':
          this.filterType = 1;
          this.whichView = 'rules';
          this.navEdit = 'rules-edit';
        break;

        case 'other':
          this.filterType = 2;
          this.whichView = 'other';
          this.navEdit = 'rules-edit';
        break;

      }
      const params = {'maxResults': this.maxResults, 'expand': 'accessGroup', 'filter': 'fileType='+this.filterType+''};

      this.gs.getAll(SERV.FILES,params).subscribe((files: any) => {
        this.allfiles = files.values;
        this.dtTrigger.next(void 0);
      });

      const self = this;
      this.dtOptions = {
        dom: 'Bfrtip',
        scrollX: true,
        pageLength: 25,
        lengthMenu: [
          [10, 25, 50, 100, 250, -1],
          [10, 25, 50, 100, 250, 'All']
        ],
        scrollY: true,
        stateSave: true,
        destroy: true,
        select: {
          style: 'multi',
          },
        order: [[0, 'desc']],
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
                  columns: [0, 1, 2, 3, 4, 5]
                },
              },
              {
                extend: 'print',
                exportOptions: {
                  columns: [0, 1, 2, 3, 4, 5]
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
                    data = "Agents\n\n"+  dt;
                  }
                  return data;
               }
              },
              {
                extend: 'copy',
              }
              ]
            },
            {
              extend: 'collection',
              text: 'Bulk Actions',
              buttons: [
                    {
                      text: 'Delete Files',
                      autoClose: true,
                      action: function (e, dt, node, config) {
                        self.onDeleteBulk();
                      }
                    },
                    {
                      text: 'Change Type',
                      autoClose: true,
                      action: function ( e, dt, node, config ) {
                        const title = 'Edit File Type'
                        self.onModalEditType(title)
                      }
                    },
                    {
                      text: 'Line Count (Missing API Call)',
                      autoClose: true,
                      action: function ( e, dt, node, config ) {
                      }
                    }
                ]
             },
             {
              extend: 'colvis',
              text: 'Column View',
              columns: [0, 1, 2, 3, 4, 5],
            },
             {
              extend: "pageLength",
              className: "btn-sm"
             }
          ],
        }
      };

    });
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

  deleteFile(id: number){
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
          this.gs.delete(SERV.FILES,id).subscribe(() => {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500
            })
            this.ngOnInit();
            this.rerender();  // rerender datatables
          });
        } else {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: "Your File is safe!",
            icon: "error",
            showConfirmButton: false,
            timer: 1500
          })
        }
      });
  }

// Bulk Actions

  onSelectedFiles(){
    $(".dt-button-background").trigger("click");
    const selection = $($(this.dtElement).DataTable.tables()).DataTable().rows({ selected: true } ).data().pluck(0).toArray();
    if(selection.length == 0) {
      Swal.fire({
        title: "You haven't selected any File",
        type: 'success',
        timer: 1500,
        showConfirmButton: false
      })
      return;
    }
    const selectionnum = selection.map(i=>Number(i));

    return selectionnum;
  }

  onDeleteBulk(){
    const self = this;
    const selectionnum = this.onSelectedFiles();
    const sellen = selectionnum.length;
    const errors = [];
    selectionnum.forEach(function (value) {
      Swal.fire('Deleting...'+sellen+' File(s)...Please wait')
      Swal.showLoading()
    self.gs.delete(SERV.FILES,value)
    .subscribe(
      err => {
        console.log('HTTP Error', err)
        err = 1;
        errors.push(err);
      },
      );
      });
    self.onDone(sellen);
  }

  onUpdateBulk(value: any){
      const self = this;
      const selectionnum = this.onSelectedFiles();
      const sellen = selectionnum.length;
      // let edit = {fileType: value};
      selectionnum.forEach(function (id) {
        Swal.fire('Updating...'+sellen+' File(s)...Please wait')
        Swal.showLoading()
      self.gs.update(SERV.FILES, id, value).subscribe(
      );
    });
    self.onDone(sellen);
  }

  onDone(value?: any){
    setTimeout(() => {
      this.ngOnInit();
      this.rerender();  // rerender datatables
      Swal.close();
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: "Success",
        showConfirmButton: false,
        timer: 1500
      })
    },3000);
  }

  onEdit(id: number){
    this.router.navigate(['/files',id,this.navEdit]);
  }

  onModalEditType(title: string){
    (async () => {

      $(".dt-button-background").trigger("click");
      const selection = $($(this.dtElement).DataTable.tables()).DataTable().rows({ selected: true } ).data().pluck(0).toArray();
      if(selection.length == 0) {
        Swal.fire({
          title: "You haven't selected any File",
          type: 'success',
          timer: 1500,
          showConfirmButton: false
        })
        return;
      }

      const { value: formValues } = await Swal.fire({
        title: title,
        html:
          '<select id="filetype" class="swal2-input"><option value="0">WordList</option><option value=1>Rules</option><option value=2>Other</option></select>',
        focusConfirm: false,
        confirmButtonColor: '#4B5563',
        preConfirm: () => {
          return [
            (<HTMLInputElement>document.getElementById('filetype')).value,
          ]
        }
      })

      if (formValues) {
        const edit = {fileType: +formValues};
        this.onUpdateBulk(edit);
      }

      })()
  }


}
