import { faMagnifyingGlass, faUpload, faInfoCircle, faFileUpload, faSearchPlus, faLink } from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit, ChangeDetectionStrategy ,ChangeDetectorRef, HostListener  } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from './../../../environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Router } from '@angular/router';
import { Observable, delay } from 'rxjs';
import { Buffer } from 'buffer';

import { UIConfigService } from 'src/app/core/_services/shared/storage.service';
import { UploadTUSService } from '../../core/_services/files/files_tus.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { FileSizePipe } from 'src/app/core/_pipes/file-size.pipe';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { ShowHideTypeFile } from '../../shared/utils/forms';
import { validateFileExt } from '../../shared/utils/util';
import { UploadFileTUS } from '../../core/_models/files';
import { SERV } from '../../core/_services/main.config';

@Component({
  selector: 'app-new-hashlist',
  templateUrl: './new-hashlist.component.html',
  providers: [FileSizePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@PageTitle(['New Hashlist'])
export class NewHashlistComponent implements OnInit {
  /**
   * Fa Icons
   *
  */
  faMagnifyingGlass=faMagnifyingGlass;
  faFileUpload=faFileUpload;
  faInfoCircle=faInfoCircle;
  faSearchPlus=faSearchPlus;
  faUpload=faUpload;
  faLink=faLink;

  /**
   * Form Settings
   *
  */
  signupForm: FormGroup;
  ShowHideTypeFile = ShowHideTypeFile;
  radio=true;
  brainenabled:any;
  hashcatbrain: string;

  // accessgroup: AccessGroup; //Use models when data structure is reliable
  accessgroup: any[]
  private maxResults = environment.config.prodApiMaxResults;

  constructor(
     private _changeDetectorRef: ChangeDetectorRef,
     private uploadService:UploadTUSService,
     private uiService: UIConfigService,
     private modalService: NgbModal,
     private gs: GlobalService,
     private fs:FileSizePipe,
     private router: Router,
     ) {
     }

  ngOnInit(): void {

    this.brainenabled = this.uiService.getUIsettings('hashcatBrainEnable').value;

    const params = {'maxResults': this.maxResults};

    this.gs.getAll(SERV.ACCESS_GROUPS, params).subscribe((agroups: any) => {
      this.accessgroup = agroups.values;
    });

    this.signupForm = new FormGroup({
      'name': new FormControl('', [Validators.required]),
      'hashTypeId': new FormControl('', [Validators.required]),
      'format': new FormControl(null),
      'separator': new FormControl(null || ';'),
      'isSalted': new FormControl(false),
      'isHexSalt': new FormControl(false),
      'accessGroupId': new FormControl(null, [Validators.required]),
      'useBrain': new FormControl(+this.brainenabled=== 1? true:false),
      'brainFeatures': new FormControl(null || 3),
      'notes': new FormControl(''),
      "sourceType": new FormControl('import' || null),
      "sourceData": new FormControl(''),
      'hashCount': new FormControl(0),
      'isArchived': new FormControl(false),
      'isSecret': new FormControl(true),
    });

  }

  ngAfterViewInit() {

    this.uploadProgress = this.uploadService.uploadProgress; // TUS upload progress

    const params = {'maxResults': this.maxResults};

    this.gs.getAll(SERV.HASHTYPES,params).subscribe((htypes: any) => {
      const self = this;
      const prep = htypes.values;
      const response = [];
      for(let i=0; i < prep.length; i++){
        const obj = { hashTypeId: prep[i].hashTypeId, descrId: prep[i].hashTypeId +' '+prep[i].description };
        response.push(obj)
      }
      ($("#hashtype") as any).selectize({
        plugins: ['remove_button'],
        valueField: "hashTypeId",
        placeholder: "Search hashtype...",
        labelField: "descrId",
        searchField: ["descrId"],
        loadingClass: 'Loading..',
        highlight: true,
        onChange: function (value) {
            self.OnChangeValue(value);
        },
        render: {
          option: function (item, escape) {
            return '<div  class="style_selectize">' + escape(item.descrId) + '</div>';
          },
        },
        onInitialize: function(){
          const selectize = this;
            selectize.addOption(response);
            const selected_items = [];
            $.each(response, function( i, obj) {
                selected_items.push(obj.id);
            });
            selectize.setValue(selected_items);
          }
          });
      });

    }

  OnChangeValue(value){
    this.signupForm.patchValue({
      hashTypeId: Number(value)
    });
    this._changeDetectorRef.detectChanges();
  }

  // FILE UPLOAD: TUS File Uload
  uploadProgress: Observable<UploadFileTUS[]>;
  filenames: string[] = [];

  onuploadFile(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      this.filenames.push(files[i].name);
      console.log(`Uploading ${files[i].name} with size ${files[i].size} and type ${files[i].type}`);
      this.uploadService.uploadFile(files[i], files[i].name);
    }
  }

  onuploadCancel(filename: string) {
    // this.uploadService.cancelUpload(filename);
  }

  /**
   * Drop Zone Area
   *
  */
  fileList : any = [];
  invalidFiles : any = [];

  onFilesChange(fileList : Array<File> | DragEvent){
    this.fileList = fileList;
  }

  onFileInvalids(fileList : Array<File> | DragEvent){
    this.invalidFiles = fileList;
  }

  /**
   * Handle Input and return file size
   * @param event
  */

  validateFileExt = validateFileExt;

  fileGroup: number;
  fileToUpload: File | null = null;
  fileSize: any;
  fileName: any;

  handleFileInput(event: any) {
    this.fileToUpload = event.target.files[0];
    this.fileSize = this.fileToUpload.size;
    this.fileName = this.fileToUpload.name;
    $('.fileuploadspan').text('Size: '+this.fs.transform(this.fileToUpload.size,false));
  }

  /**
   * Create Hashlist
   *
  */

  submitted = false;
  onSubmitFile(): void{
    setTimeout(() => {
      this.onSubmit();
      this.submitted = true;
    },1000);
  }

  onSubmit(): void{
      if (this.signupForm.valid) {

      const res = this.handleUpload(this.signupForm.value);

      this.gs.create(SERV.HASHLISTS,res).subscribe(() => {
        Swal.fire({
          title: "Success",
          text: "New HashList created!",
          icon: "success",
          showConfirmButton: false,
          timer: 1500
        });
        this.router.navigate(['/hashlists/hashlist']);
      }
    );
    }
  }

  handleUpload(arr: any){
    const str = arr.sourceData;
    const filereplace = str.replace("C:\\fakepath\\", "");
    let filename = filereplace;
    if(arr.sourceType === 'paste'){
      filename = Buffer.from(filereplace).toString('base64');
    }

    const res = {
      'name': arr.name,
      'hashTypeId': arr.hashTypeId,
      'format': arr.format,
      'separator': arr.separator,
      'isSalted': arr.isSalted,
      'isHexSalt': arr.isHexSalt,
      'accessGroupId': arr.accessGroupId,
      'useBrain': arr.useBrain,
      'brainFeatures': arr.brainFeatures,
      'notes': arr.notes,
      "sourceType": arr.sourceType,
      "sourceData": filename,
      'hashCount': arr.hashCount,
      'isArchived': arr.isArchived,
      'isSecret': arr.isSecret,
     }
     return res;
  }

  // @HostListener allows us to also guard against browser refresh, close, etc.
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (!this.canDeactivate()) {
      $event.returnValue = "IE and Edge Message";
    }
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.signupForm.valid) {
    return false;
    }
    return true;
  }

  // Open Modal
  // Modal Information
  closeResult = '';
  open(content) {
    this.modalService.open(content, { size: 'xl' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
