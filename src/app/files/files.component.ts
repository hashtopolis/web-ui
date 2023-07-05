import { faEdit, faTrash, faPlus, faLock} from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

import { AccessGroupsService } from '../core/_services/access/accessgroups.service';
import { UploadTUSService } from '../core/_services/files/files_tus.service';
import { FilesService } from '../core/_services/files/files.service';
import { UsersService } from '../core/_services/users/users.service';
import { environment } from './../../environments/environment';
import { AccessGroup } from '../core/_models/access-group';
import { PageTitle } from '../core/_decorators/autotitle';
import { Filetype } from '../core/_models/files';

declare let $:any;

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html'
})
@PageTitle(['Show Files'])
export class FilesComponent implements OnInit {

  // Title Page
  wTitle = "WordLists";
  wbuttontitle = "New WordList";
  wbuttonlink = "/files/wordlist/new-wordlist";
  wsubbutton = true;
  rTitle = "Rules";
  rbuttontitle = "New Rule";
  rbuttonlink = "/files/rules/new-rule";
  rsubbutton = true;
  oTitle = "Other";
  obuttontitle = "New Other";
  obuttonlink = "/files/other/new-other";
  osubbutton = true;

  isLoading= false;
  faTrash=faTrash;
  faPlus=faPlus;
  faLock=faLock;
  faEdit=faEdit;

  public allfiles: {
    fileId: number,
    filename: string,
    size: number,
    isSecret: number,
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
    private accessgroupService:AccessGroupsService,
    private uploadService:UploadTUSService,
    private filesService:FilesService,
    private route:ActivatedRoute,
    private users:UsersService,
    private http:HttpClient,
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

  ngOnInit(): void {

    this.setAccessPermissions();
    this.loadFiles();

  }

  // Set permissions
  viewFileAccess: any;
  manageFileAccess: any;
  addFileAccess: any;

  setAccessPermissions(){
    this.users.getUser(this.users.userId,{'expand':'globalPermissionGroup'}).subscribe((perm: any) => {
        this.viewFileAccess = perm.globalPermissionGroup.permissions.viewFileAccess;
        this.manageFileAccess = perm.globalPermissionGroup.permissions.manageFileAccess;
        this.addFileAccess = perm.globalPermissionGroup.permissions.addFileAccess;
    });
  }

  loadFiles(){
    this.route.data.subscribe(data => {
      switch (data['kind']) {

        case 'wordlist':
          this.filterType = 0
          this.whichView = 'wordlist';
        break;

        case 'rules':
          this.filterType = 1
          this.whichView = 'rules';
        break;

        case 'other':
          this.filterType = 2
          this.whichView = 'other';
        break;

      }
      let params = {'maxResults': this.maxResults, 'expand': 'accessGroup', 'filter': 'fileType='+this.filterType+''}

      this.filesService.getFiles(params).subscribe((files: any) => {
        this.allfiles = files.values;
        this.dtTrigger.next(void 0);
      });

      const self = this;
      this.dtOptions = {
        dom: 'Bfrtip',
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
              extend: "pageLength",
              className: "btn-sm"
             }
          ],
        }
      };

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

  deleteFile(id: number){
    if(this.manageFileAccess || typeof this.manageFileAccess == 'undefined'){
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
          this.filesService.deleteFile(id).subscribe(() => {
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
            text: "Your File is safe!",
            icon: "error",
            showConfirmButton: false,
            timer: 1500
          })
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

// Bulk Actions

  onSelectedFiles(){
    $(".dt-button-background").trigger("click");
    let selection = $($(this.dtElement).DataTable.tables()).DataTable().rows({ selected: true } ).data().pluck(0).toArray();
    if(selection.length == 0) {
      Swal.fire({
        title: "You haven't selected any File",
        type: 'success',
        timer: 1500,
        showConfirmButton: false
      })
      return;
    }
    let selectionnum = selection.map(i=>Number(i));

    return selectionnum;
  }

  onDeleteBulk(){
    if(this.manageFileAccess || typeof this.manageFileAccess == 'undefined'){
    const self = this;
    let selectionnum = this.onSelectedFiles();
    let sellen = selectionnum.length;
    let errors = [];
    selectionnum.forEach(function (value) {
      Swal.fire('Deleting...'+sellen+' File(s)...Please wait')
      Swal.showLoading()
    self.filesService.deleteFile(value)
    .subscribe(
      err => {
        console.log('HTTP Error', err)
        err = 1;
        errors.push(err);
      },
      );
      });
    self.onDone(sellen);
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

  onUpdateBulk(value: any){
    if(this.manageFileAccess || typeof this.manageFileAccess == 'undefined'){
      const self = this;
      let selectionnum = this.onSelectedFiles();
      let sellen = selectionnum.length;
      // let edit = {fileType: value};
      selectionnum.forEach(function (id) {
        Swal.fire('Updating...'+sellen+' File(s)...Please wait')
        Swal.showLoading()
      self.filesService.updateBulkFile(id, value).subscribe(
      );
    });
    self.onDone(sellen);
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

  onDone(value?: any){
    setTimeout(() => {
      this.ngOnInit();
      this.rerender();  // rerender datatables
      Swal.close();
      Swal.fire({
        title: 'Done!',
        type: 'success',
        timer: 1500,
        showConfirmButton: false
      })
    },3000);
  }

  onModalEditType(title: string){
    (async () => {

      $(".dt-button-background").trigger("click");
      let selection = $($(this.dtElement).DataTable.tables()).DataTable().rows({ selected: true } ).data().pluck(0).toArray();
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
        let edit = {fileType: +formValues};
        this.onUpdateBulk(edit);
      }

      })()
  }


}
