import {
  faDownload,
  faFileUpload,
  faLink,
  faPlus,
  faUpload
} from '@fortawesome/free-solid-svg-icons';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject, Subscription, takeUntil } from 'rxjs';
// import { takeUntil } from 'rxjs/operators';
import { Buffer } from 'buffer';

import { UploadTUSService } from 'src/app/core/_services/files/files_tus.service';
import { AlertService } from 'src/app/core/_services/shared/alert.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { FileSizePipe } from 'src/app/core/_pipes/file-size.pipe';
import { environment } from './../../../environments/environment';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { validateFileExt } from '../../shared/utils/util';
import { ActivatedRoute, Router } from '@angular/router';
import { UploadFileTUS } from '../../core/_models/file.model';
import { SERV } from '../../core/_services/main.config';
import { subscribe } from 'diagnostics_channel';
import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { UnsubscribeService } from 'src/app/core/_services/unsubscribe.service';
import { transformSelectOptions } from 'src/app/shared/utils/forms';

@Component({
  selector: 'app-new-files',
  templateUrl: './new-files.component.html',
  providers: [FileSizePipe]
})
export class NewFilesComponent implements OnInit, OnDestroy {
  /** Flag indicating whether data is still loading. */
  isLoading = true;

  faFileUpload = faFileUpload;
  faDownload = faDownload;
  faUpload = faUpload;
  faLink = faLink;
  faPlus = faPlus;

  filterType: number;
  whichView: string;
  form: FormGroup;
  submitted = false;

  // Lists of Selected inputs
  selectAccessgroup: any[];

  private maxResults = environment.config.prodApiMaxResults;
  subscriptions: Subscription[] = [];

  constructor(
    private unsubscribeService: UnsubscribeService,
    private changeDetectorRef: ChangeDetectorRef,
    private uploadService: UploadTUSService,
    private titleService: AutoTitleService,
    private route: ActivatedRoute,
    private alert: AlertService,
    private gs: GlobalService,
    private fs: FileSizePipe,
    private router: Router
  ) {
    this.getLocation();
    this.buildForm();
    titleService.set([this.title]);
  }

  // Get Title
  public title: string;
  public redirect: string;
  getLocation() {
    this.route.data.subscribe((data) => {
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
    });
  }

  /**
   * Lifecycle hook called after component initialization.
   */
  ngOnInit(): void {
    this.loadData();
  }

  /**
   * Lifecycle hook called before the component is destroyed.
   * Unsubscribes from all subscriptions to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.unsubscribeService.unsubscribeAll();
  }

  /**
   * Builds the form for creating a new Hashlist.
   */
  buildForm(): void {
    this.form = new FormGroup({
      filename: new FormControl(''),
      isSecret: new FormControl(false),
      fileType: new FormControl(this.filterType),
      accessGroupId: new FormControl(1),
      sourceType: new FormControl('import' || ''),
      sourceData: new FormControl('')
    });

    //subscribe to changes to handle select salted hashes
    // this.form.get('hashTypeId').valueChanges.subscribe((newvalue) => {
    //   this.handleSelectedItems(newvalue);
    // });
  }

  // ngOnDestroy() {
  //   this.subs.forEach((s) => s.unsubscribe());
  //   for (const sub of this.subscriptions) {
  //     sub.unsubscribe();
  //   }
  //   this.ngUnsubscribe.next(false);
  //   this.ngUnsubscribe.complete();
  // }

  loadData() {
    const fieldAccess = {
      fieldMapping: {
        name: 'groupName',
        _id: '_id'
      }
    };
    const accedgroupSubscription$ = this.gs
      .getAll(SERV.ACCESS_GROUPS)
      .subscribe((response: any) => {
        const transformedOptions = transformSelectOptions(
          response.values,
          fieldAccess
        );
        this.selectAccessgroup = transformedOptions;
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      });
    this.unsubscribeService.add(accedgroupSubscription$);
  }

  /**
   * Create File
   *
   */
  onSubmit(): void {
    if (this.form.valid && this.submitted === false) {
      let form = this.onPrep(this.form.value, false);

      this.submitted = true;

      if (form.status === false) {
        this.subscriptions.push(
          this.gs.create(SERV.FILES, form.update).subscribe(() => {
            form = this.onPrep(this.form.value, true);
            this.alert.okAlert('New File created!', '');
            this.submitted = false;
            this.router.navigate(['/files', this.redirect]);
          })
        );
      }
    }
  }

  onPrep(obj: any, status: boolean) {
    let sourcadata;
    let fname;
    if (obj.sourceType == 'inline') {
      fname = obj.filename;
      sourcadata = Buffer.from(obj.sourceData).toString('base64');
    } else {
      sourcadata = this.fileName;
      fname = this.fileName;
    }
    const res = {
      update: {
        filename: fname,
        isSecret: obj.isSecret,
        fileType: this.filterType,
        accessGroupId: obj.accessGroupId,
        sourceType: obj.sourceType,
        sourceData: sourcadata
      },
      status: status
    };
    return res;
  }

  souceType(type: string, view: string) {
    this.viewMode = view;
    this.form.patchValue({
      filename: '',
      accessGroupId: 1,
      sourceType: type,
      sourceData: ''
    });
  }

  // Uploading file
  @ViewChild('file', { static: false }) file: ElementRef;
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
    $('.fileuploadspan').text(this.fs.transform(this.fileToUpload.size, false));
  }

  private subs: Subscription[] = [];
  private ngUnsubscribe = new Subject();

  onuploadFile(files: FileList) {
    const form = this.onPrep(this.form.value, false);
    const upload: Array<any> = [];
    for (let i = 0; i < files.length; i++) {
      upload.push(
        this.uploadService
          .uploadFile(files[i], files[i].name, SERV.FILES, form.update, [
            '/files',
            this.redirect
          ])
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((progress) => {
            this.uploadProgress = progress;
            // console.log(`Upload progress: ${progress}%`);
          })
      );
    }
    // this.reset();
  }

  reset() {
    this.file.nativeElement.value = null;
  }
}
