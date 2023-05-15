import { faEdit, faTrash, faHomeAlt, faPlus, faUpload, faFileImport, faDownload, faPaperclip, faLink, faLock, faFileUpload} from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { FormControl, FormGroup} from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { Buffer } from 'buffer';

import { UploadTUSService } from '../core/_services/files/files_tus.service';
import { AccessGroupsService } from '../core/_services/access/accessgroups.service';
import { fileSizeValue, validateFileExt } from '../shared/utils/util';
import { FilesService } from '../core/_services/files/files.service';
import { environment } from './../../environments/environment';

import { UsersService } from '../core/_services/users/users.service';
import { AccessGroup } from '../core/_models/access-group';
import { UploadFileTUS } from '../core/_models/files';
import { Filetype } from '../core/_models/files';

declare let $:any;

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html'
})

export class FilesComponent implements OnInit {
  public isCollapsed = true;

  isLoading= false;
  faFileImport=faFileImport;
  faFileUpload=faFileUpload;
  faPaperclip=faPaperclip;
  faDownload=faDownload;
  faUpload=faUpload;
  faHome=faHomeAlt;
  faTrash=faTrash;
  faPlus=faPlus;
  faLink=faLink;
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

  constructor(
    private accessgroupService:AccessGroupsService,
    private uploadService:UploadTUSService,
    private filesService: FilesService,
    private route:ActivatedRoute,
    private users: UsersService,
    private http: HttpClient,
    private router: Router
    ) { }

// accessgroup: AccessGroup; //Use models when data structure is reliable
  accessgroup: any[]

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  ngOnDestroy(){
    this.dtTrigger.unsubscribe();
  }

  filterType: number
  whichView: string;
  createForm: FormGroup;

  private maxResults = environment.config.prodApiMaxResults

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

      this.accessgroupService.getAccessGroups().subscribe((agroups: any) => {
        this.accessgroup = agroups.values;
      });

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

      this.createForm = new FormGroup({
        filename: new FormControl(''),
        isSecret: new FormControl(false),
        fileType: new FormControl(this.filterType),
        accessGroupId: new FormControl(''),
        sourceType: new FormControl('import' || ''),
        sourceData: new FormControl(''),
      });

      this.uploadProgress = this.uploadService.uploadProgress; //Uploading File using tus protocol

    });
  }


  /**
   * Create File
   *
  */

    onSubmit(): void{
      if (this.createForm.valid) {

      this.isLoading = true;

      var form = this.onPrep(this.createForm.value);

      this.filesService.createFile(form).subscribe((hl: any) => {
        this.isLoading = false;
        Swal.fire({
          title: "Good job!",
          text: "New File created!",
          icon: "success",
          showConfirmButton: false,
          timer: 1500
        });
        // this.createForm.reset(this.createForm.value); // success, we reset form
        // // this.isCollapsed = true;
        // this.ngOnInit();
        // this.rerender();
        window.location.reload();
      },
      errorMessage => {
        Swal.fire({
          title: "Oppss! Error",
          text: errorMessage.error.message,
          icon: "warning",
          showConfirmButton: true
        });
      }
    );
    }
  }

  souceType(type: string){
    this.createForm.patchValue({
      filename: '',
      accessGroupId: '',
      sourceType:type,
      sourceData:''
    });
  }

  onPrep(obj: any){
    var sourcadata;
    var fname;
    if(obj.sourceType == 'inline'){
      fname = obj.filename;
      sourcadata = Buffer.from(obj.sourceData).toString('base64');
    }else{
      sourcadata = this.fileName;
      fname = this.fileName;
    }
    var res = {
      "filename": fname,
      "isSecret": obj.isSecret,
      "fileType": obj.fileType,
      "accessGroupId": obj.accessGroupId,
      "sourceType": obj.sourceType,
      "sourceData": sourcadata
     }
     return res;
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

  // Uploading file
  uploadProgress: Observable<UploadFileTUS[]>;
  filenames: string[] = [];

  isHovering: boolean;

  toggleHover(event) {
    this.isHovering = event;
    console.log(event)
  }

  fileSizeValue = fileSizeValue;

  validateFileExt = validateFileExt;

  selectedFile: '';
  fileGroup: number;
  fileToUpload: File | null = null;
  fileSize: any;
  fileName: any;

  handleFileInput(event: any) {
    this.fileToUpload = event.target.files[0];
    this.fileSize = this.fileToUpload.size;
    this.fileName = this.fileToUpload.name;
    $('.fileuploadspan').text(fileSizeValue(this.fileToUpload.size));
  }

  onuploadFile(files: FileList) {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < files.length; i++) {
      this.filenames.push(files[i].name);
      console.log(`Uploading ${files[i].name} with size ${files[i].size} and type ${files[i].type}`);
      this.uploadService.uploadFile(files[i], files[i].name);
    }
  }

  deleteFile(id: number){
    if(this.manageFileAccess || typeof this.manageFileAccess == 'undefined'){
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
          this.filesService.deleteFile(id).subscribe(() => {
            Swal.fire(
              "File has been deleted!",
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
            'No worries, your File is safe!',
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
