import { Component, OnInit, ChangeDetectionStrategy ,ChangeDetectorRef, HostListener  } from '@angular/core';
import { faMagnifyingGlass, faUpload, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from './../../../environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { ShowHideTypeFile } from '../../shared/utils/forms';
import { fileSizeValue, validateFileExt } from '../../shared/utils/util';
import { ListsService } from '../../core/_services/hashlist/hashlist.service';
import { HashtypeService } from 'src/app/core/_services/hashtype.service';
import { AccessGroupsService } from '../../core/_services/accessgroups.service';
import { UIConfigService } from 'src/app/core/_services/shared/storage.service';
import { UploadTUSService } from '../../core/_services/files/files_tus.service';
import { AccessGroup } from '../../core/_models/access-group';
import { UploadFileTUS } from '../../core/_models/files';

@Component({
  selector: 'app-new-hashlist',
  templateUrl: './new-hashlist.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewHashlistComponent implements OnInit {
  /**
   * Fa Icons
   *
  */
  isLoading = false;
  faUpload=faUpload;
  faInfoCircle=faInfoCircle;
  faMagnifyingGlass=faMagnifyingGlass;

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
     private hlService: ListsService,
     private _changeDetectorRef: ChangeDetectorRef,
     private hashtypeService: HashtypeService,
     private accessgroupService: AccessGroupsService,
     private uiService: UIConfigService,
     private router: Router,
     private uploadService:UploadTUSService,
     ) { }

  ngOnInit(): void {
    this.isLoading = true;

    this.brainenabled = this.uiService.getUIsettings('hashcatBrainEnable').value;

    this.accessgroupService.getAccessGroups().subscribe((agroups: any) => {
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
      "sourceType": new FormControl('upload' || null),
      "sourceData": new FormControl(''),
      'hashCount': new FormControl(0),
      'cracked': new FormControl(0),
      'isArchived': new FormControl(false),
      'isSecret': new FormControl(true),
    });

  }

  ngAfterViewInit() {

    this.uploadProgress = this.uploadService.uploadProgress; // TUS upload progress

    let params = {'maxResults': this.maxResults};

    this.hashtypeService.getHashTypes(params).subscribe((htypes: any) => {
      var self = this;
      var response = htypes.values;
      ($("#hashtype") as any).selectize({
        plugins: ['remove_button'],
        valueField: "hashTypeId",
        placeholder: "Search hashtype...",
        labelField: "description",
        searchField: ["description"],
        loadingClass: 'Loading..',
        highlight: true,
        onChange: function (value) {
            self.OnChangeValue(value); // We need to overide DOM event, Angular vs Jquery
        },
        render: {
          option: function (item, escape) {
            return '<div  class="hashtype_selectize">' + escape(item.hashTypeId) + ' -  ' + escape(item.description) + '</div>';
          },
        },
        onInitialize: function(){
          var selectize = this;
            selectize.addOption(response); // This is will add to option
            var selected_items = [];
            $.each(response, function( i, obj) {
                selected_items.push(obj.id);
            });
            selectize.setValue(selected_items); //this will set option values as default
          }
          });
        });

    }

  OnChangeValue(value){
    this.signupForm.patchValue({
      hashTypeId: value
    });
    this._changeDetectorRef.detectChanges();
  }

  // FILE UPLOAD: TUS File Uload
  uploadProgress: Observable<UploadFileTUS[]>;
  filenames: string[] = [];

  onuploadFile(event: any) {
    console.log(event)
    const file = event.item(0)
    // const filename = `${new Date().getTime()}_${file.name}`;
    const filename = file.name;
      console.log(`Uploading ${file.name} with size ${file.size} and type ${file.type}`);
    this.uploadService.uploadFile(file, filename);
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

  fileSizeValue = fileSizeValue;

  validateFileExt = validateFileExt;

  fileGroup: number;
  fileToUpload: File | null = null;
  fileSize: any;
  fileName: any;

  handleFileInput(event: any) {
    this.fileToUpload = event.target.files[0];
    this.fileSize = this.fileToUpload.size;
    this.fileName = this.fileToUpload.name;
    $('.fileuploadspan').text('Size: '+fileSizeValue(this.fileToUpload.size));
  }

  /**
   * Create Hashlist
   *
   */

  onSubmit(): void{
      if (this.signupForm.valid) {
      console.log(this.signupForm.value);

      this.isLoading = true;

      this.hlService.createHashlist(this.signupForm.value).subscribe((hl: any) => {
        this.isLoading = false;
        Swal.fire({
          title: "Good job!",
          text: "New HashList created!",
          icon: "success",
          showConfirmButton: false,
          timer: 1500
        });
        this.router.navigate(['/hashlists/hashlist']);
      },
      errorMessage => {
        // check error status code is 500, if so, do some action
        // const exception = errorMessage.error.message.exception[0].message;
        // const exception2 = errorMessage.error.message.exception['0'].message;
        // console.log(exception);
        // console.log(exception2);
        Swal.fire({
          title: "Oppss! Error",
          text: errorMessage.error.message,
          icon: "warning",
          showConfirmButton: true
        });
      }
    );
    // this.signupForm.reset(); // success, we reset form
    }
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
}
