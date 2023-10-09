import { faPlus, faUpload, faDownload, faLink, faFileUpload} from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Injectable, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, ReplaySubject, Subject, Subscription, map, of, pairwise, startWith, switchMap, take, takeUntil, tap } from 'rxjs';
// import { takeUntil } from 'rxjs/operators';
import { Buffer } from 'buffer';

import { UploadTUSService } from 'src/app/core/_services/files/files_tus.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { FileSizePipe } from 'src/app/core/_pipes/file-size.pipe';
import { environment } from './../../../environments/environment';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { validateFileExt } from '../../shared/utils/util';
import { ActivatedRoute, Router } from '@angular/router';
import { UploadFileTUS } from '../../core/_models/files';
import { SERV } from '../../core/_services/main.config';
import { subscribe } from 'diagnostics_channel';

@Component({
  selector: 'app-new-files',
  templateUrl: './new-files.component.html',
  providers: [FileSizePipe]
})
// @PageTitle(['New File'])
export class NewFilesComponent implements OnInit, OnDestroy {

  faFileUpload=faFileUpload;
  faDownload=faDownload;
  faUpload=faUpload;
  faLink=faLink;
  faPlus=faPlus;

  private maxResults = environment.config.prodApiMaxResults;
  subscriptions: Subscription[] = []

  constructor(
    private uploadService:UploadTUSService,
    private route:ActivatedRoute,
    private gs: GlobalService,
    private fs:FileSizePipe,
    private router: Router
  ) {

   }

  accessgroup: any[]
  filterType: number;
  whichView: string;
  createForm: FormGroup;
  submitted = false;

  ngOnInit(): void {

    this.getLocation();

    this.loadData();

  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
    for (const sub of this.subscriptions) {
      sub.unsubscribe()
    }
    this.ngUnsubscribe.next(false);
    this.ngUnsubscribe.complete();
  }

  loadData(){

    const params = {'maxResults': this.maxResults};

    this.gs.getAll(SERV.ACCESS_GROUPS,params).subscribe((agroups: any) => {
      this.accessgroup = agroups.values;
    });

    this.createForm = new FormGroup({
      filename: new FormControl(''),
      isSecret: new FormControl(false),
      fileType: new FormControl(this.filterType),
      accessGroupId: new FormControl(1),
      sourceType: new FormControl('import' || ''),
      sourceData: new FormControl(''),
    });

  }

  /**
   * Create File
   *
  */
  onSubmit(): void{
    if (this.createForm.valid && this.submitted === false) {

    let form = this.onPrep(this.createForm.value, false);

    this.submitted =true;

    if(form.status === false){
      this.subscriptions.push(this.gs.create(SERV.FILES,form.update).subscribe(() => {
        form = this.onPrep(this.createForm.value, true);
        Swal.fire({
          position: 'top-end',
          backdrop: false,
          icon: 'success',
          title: "Success!",
          text: "New File created!",
          showConfirmButton: false,
          timer: 1500
        })
        this.submitted = false;
        this.router.navigate(['/files',this.redirect]);
      }));
    }
  }
}

onPrep(obj: any, status: boolean){
  let sourcadata;
  let fname;
  if(obj.sourceType == 'inline'){
    fname = obj.filename;
    sourcadata = Buffer.from(obj.sourceData).toString('base64');
  }else{
    sourcadata = this.fileName;
    fname = this.fileName;
  }
  const res = {
    "update":{
      "filename": fname,
      "isSecret": obj.isSecret,
      "fileType": this.filterType,
      "accessGroupId": obj.accessGroupId,
      "sourceType": obj.sourceType,
      "sourceData": sourcadata
    },"status": status
    }
    return res;
}

souceType(type: string, view: string){
  this.viewMode = view;
  this.createForm.patchValue({
    filename: '',
    accessGroupId: 1,
    sourceType:type,
    sourceData:''
  });
}

// Get Title
  public title: string;
  public redirect: string;
  getLocation(){
    this.route.data.subscribe(data => {
      switch (data['kind']) {

        case 'wordlist-new':
          this.filterType = 0;
          this.title = 'New Wordlist';
          this.redirect = 'wordlist';
        break;

        case 'rule-new':
          this.filterType = 1;
          this.title = 'New Rule';
          this.redirect = 'rules';
        break;

        case 'other-new':
          this.filterType = 2;
          this.title = 'New Other';
          this.redirect = 'other';
        break;

      }
    })
  }

// Uploading file
  @ViewChild('file', {static: false}) file: ElementRef;
  name = '!!!';
  viewMode = 'tab1';
  uploadProgress = 0;
  filenames: string[] = [];

  isHovering: boolean;

  toggleHover(event) {
    this.isHovering = event;
  }

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
    $('.fileuploadspan').text( this.fs.transform(this.fileToUpload.size,false));
  }

 private subs: Subscription[] = [];
 private ngUnsubscribe = new Subject();

 onuploadFile(files: FileList) {
    let form = this.onPrep(this.createForm.value, false);
    const upload: Array<any> = [];
    for (let i = 0; i < files.length; i++) {
      upload.push(
         this.uploadService.uploadFile(
          files[i], files[i].name, SERV.FILES, form.update, ['/files',this.redirect]
        ).pipe(takeUntil(this.ngUnsubscribe))
         .subscribe(
          (progress) => {
            this.uploadProgress = progress;
            // console.log(`Upload progress: ${progress}%`);
          }
        )
      )
    }
    // this.reset();
  }

  reset() {
    this.file.nativeElement.value = null;
  }

}
