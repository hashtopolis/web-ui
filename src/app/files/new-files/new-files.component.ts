import { faPlus, faUpload, faDownload, faLink, faFileUpload} from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Buffer } from 'buffer';

import { UploadTUSService } from 'src/app/core/_services/files/files_tus.service';
import { fileSizeValue, validateFileExt } from '../../shared/utils/util';
import { GlobalService } from 'src/app/core/_services/main.service';
import { environment } from './../../../environments/environment';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { UploadFileTUS } from '../../core/_models/files';
import { SERV } from '../../core/_services/main.config';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-new-files',
  templateUrl: './new-files.component.html'
})
@PageTitle(['New File'])
export class NewFilesComponent implements OnInit {

  faFileUpload=faFileUpload;
  faDownload=faDownload;
  faUpload=faUpload;
  faLink=faLink;
  faPlus=faPlus;

  private maxResults = environment.config.prodApiMaxResults;

  constructor(
    private uploadService:UploadTUSService,
    private route:ActivatedRoute,
    private gs: GlobalService,
    private router: Router
  ) { }

  accessgroup: any[]
  filterType: number;
  whichView: string;
  createForm: FormGroup;

  ngOnInit(): void {

    this.getLocation();

    this.loadData();

    this.createForm = new FormGroup({
      filename: new FormControl(''),
      isSecret: new FormControl(false),
      fileType: new FormControl(this.filterType),
      accessGroupId: new FormControl(1),
      sourceType: new FormControl('import' || ''),
      sourceData: new FormControl(''),
    });

    this.uploadProgress = this.uploadService.uploadProgress; //Uploading File using tus protocol

  }

  loadData(){

    const params = {'maxResults': this.maxResults};

    this.gs.getAll(SERV.ACCESS_GROUPS,params).subscribe((agroups: any) => {
      this.accessgroup = agroups.values;
    });

  }

  /**
   * Create File
   *
  */
  submitted = false;
  onSubmitFile(): void{
    this.onSubmit();
    this.submitted = true;
  }

  onSubmit(): void{

    if (this.createForm.valid) {

    const form = this.onPrep(this.createForm.value);

    this.gs.create(SERV.FILES,form).subscribe(() => {
      Swal.fire({
        title: "Success",
        text: "New File created!",
        icon: "success",
        showConfirmButton: false,
        timer: 1500
      });
      this.router.navigate(['/files',this.redirect]);
    }
  );
  }
}

onPrep(obj: any){
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
    "filename": fname,
    "isSecret": obj.isSecret,
    "fileType": this.filterType,
    "accessGroupId": obj.accessGroupId,
    "sourceType": obj.sourceType,
    "sourceData": sourcadata
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
  name = '!!!';
  viewMode = 'tab1';
  uploadProgress: Observable<UploadFileTUS[]>;
  filenames: string[] = [];

  isHovering: boolean;

  toggleHover(event) {
    this.isHovering = event;
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

  // To use as Button
  onuploadFile(files: FileList) {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < files.length; i++) {
      this.filenames.push(files[i].name);
      console.log(`Uploading ${files[i].name} with size ${files[i].size} and type ${files[i].type}`);
      this.uploadService.uploadFile(files[i], files[i].name);
    }
  }

}
