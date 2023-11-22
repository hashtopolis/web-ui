import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { environment } from './../../../environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Router } from '@angular/router';
import { Buffer } from 'buffer';

import { UIConfigService } from 'src/app/core/_services/shared/storage.service';
import { UploadTUSService } from '../../core/_services/files/files_tus.service';
import { AlertService } from 'src/app/core/_services/shared/alert.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { FileSizePipe } from 'src/app/core/_pipes/file-size.pipe';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { extractIds, transformSelectOptions } from '../../shared/utils/forms';
import { validateFileExt } from '../../shared/utils/util';
import { UploadFileTUS } from '../../core/_models/file.model';
import { SERV } from '../../core/_services/main.config';
import { SelectField } from 'src/app/core/_models/input.model';
import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { UnsubscribeService } from 'src/app/core/_services/unsubscribe.service';
import { HashtypeDetectorComponent } from 'src/app/shared/hashtype-detector/hashtype-detector.component';
import { MatDialog } from '@angular/material/dialog';
import {
  hashSource,
  hashcatbrainFormat,
  hashlistFormat
} from 'src/app/core/_constants/hashlist.config';

@Component({
  selector: 'app-new-hashlist',
  templateUrl: './new-hashlist.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FileSizePipe]
})
export class NewHashlistComponent implements OnInit, OnDestroy {
  /** Flag indicating whether data is still loading. */
  isLoadingAccessGroups = true;
  isLoadingHashtypes = true;

  /** Form group for the new SuperHashlist. */
  form: FormGroup;

  // Lists of Selected inputs
  selectAccessgroup: any[];
  selectHashtypes: any[];
  selectFormat = hashlistFormat;
  selectSource = hashSource;

  // Lists of Hashtypes
  hashtypes: any[];

  //Hashcat Brain Mode
  brainenabled: any;
  selectFormatbrain = hashcatbrainFormat;
  hashcatbrain: string;

  constructor(
    private unsubscribeService: UnsubscribeService,
    private changeDetectorRef: ChangeDetectorRef,
    private uploadService: UploadTUSService,
    private titleService: AutoTitleService,
    private uiService: UIConfigService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alert: AlertService,
    private gs: GlobalService,
    private dialog: MatDialog,
    private fs: FileSizePipe,
    private router: Router
  ) {
    this.buildForm();
    titleService.set(['New Hashlist']);
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
    this.brainenabled =
      this.uiService.getUIsettings('hashcatBrainEnable').value;

    this.form = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      hashTypeId: new FormControl('', [Validators.required]),
      format: new FormControl('' || 0),
      separator: new FormControl(null || ':'),
      isSalted: new FormControl(false),
      isHexSalt: new FormControl(false),
      accessGroupId: new FormControl(null, [Validators.required]),
      useBrain: new FormControl(+this.brainenabled === 1 ? true : false),
      brainFeatures: new FormControl(null || 3),
      notes: new FormControl(''),
      sourceType: new FormControl('import' || null),
      sourceData: new FormControl(''),
      hashCount: new FormControl(0),
      isArchived: new FormControl(false),
      isSecret: new FormControl(true)
    });

    //subscribe to changes to handle select salted hashes
    this.form.get('hashTypeId').valueChanges.subscribe((newvalue) => {
      this.handleSelectedItems(newvalue);
    });
  }

  /**
   * Loads data, Access Groups and Hashtypes, for the component.
   */
  loadData(): void {
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
        this.isLoadingAccessGroups = false;
        this.changeDetectorRef.detectChanges();
      });
    this.unsubscribeService.add(accedgroupSubscription$);

    const fieldHashtype = {
      fieldMapping: {
        name: 'description',
        _id: '_id'
      }
    };
    const hashtypesSubscription$ = this.gs
      .getAll(SERV.HASHTYPES)
      .subscribe((response: any) => {
        const transformedOptions = transformSelectOptions(
          response.values,
          fieldHashtype
        );
        this.selectHashtypes = transformedOptions;
        this.hashtypes = response.values;
        this.isLoadingHashtypes = false;
        this.changeDetectorRef.detectChanges();
      });
    this.unsubscribeService.add(hashtypesSubscription$);
  }

  get sourceType() {
    return this.form.get('sourceType').value;
  }

  // FILE UPLOAD: TUS File Uload
  @ViewChild('file', { static: false }) file: ElementRef;
  uploadProgress = 0;
  filenames: string[] = [];
  private ngUnsubscribe = new Subject();

  onuploadFile(files: FileList) {
    if (this.form.valid) {
      const newform = this.handlePathName(this.form.value);
      const upload: Array<any> = [];
      for (let i = 0; i < files.length; i++) {
        upload.push(
          this.uploadService
            .uploadFile(files[i], files[i].name, SERV.HASHLISTS, newform, [
              '/hashlists/hashlist'
            ])
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((progress) => {
              this.uploadProgress = progress;
            })
        );
      }
    }
  }

  /**
   * Handle Input and return file size
   * @param event
   */

  selectedFile: '';
  fileGroup: number;
  fileToUpload: File | null = null;
  fileSize: any;
  fileName: any;

  handleFileInput(event: any) {
    this.fileToUpload = event.target.files[0];
    this.fileSize = this.fileToUpload.size;
    this.fileName = this.fileToUpload.name;
    $('.fileuploadspan').text(
      ' ' +
        this.fileName +
        ' / Size: ' +
        this.fs.transform(this.fileToUpload.size, false)
    );
  }

  /**
   * Create Hashlist
   *
   */

  onSubmit(): void {
    if (this.form.valid) {
      this.handleEncode();
      const onSubmitSubscription$ = this.gs
        .create(SERV.HASHLISTS, this.form.value)
        .subscribe(() => {
          this.alert.okAlert('New HashList created!', '');
          this.router.navigate(['/hashlists/hashlist']);
        });
      this.unsubscribeService.add(onSubmitSubscription$);
    }
  }

  handleEncode() {
    const fileType = this.form.get('sourceType').value;
    if (fileType === 'paste') {
      const fileSource = this.form.get('sourceType').value;
      this.form.patchValue({
        sourceData: Buffer.from(fileSource).toString('base64')
      });
    }
  }

  handlePathName(form: any) {
    const filePath = this.form.get('sourceData').value;
    const fileReplacePath = filePath.replace('C:\\fakepath\\', '');
    const res = {
      name: form.name,
      hashTypeId: form.hashTypeId,
      format: form.format,
      separator: form.separator,
      isSalted: form.isSalted,
      isHexSalt: form.isHexSalt,
      accessGroupId: form.accessGroupId,
      useBrain: form.useBrain,
      brainFeatures: form.brainFeatures,
      notes: form.notes,
      sourceType: form.sourceType,
      sourceData: fileReplacePath,
      hashCount: form.hashCount,
      isArchived: form.isArchived,
      isSecret: form.isSecret
    };
    return res;
  }

  // Open Modal Hashtype Detector
  openHelpDialog(): void {
    const dialogRef = this.dialog.open(HashtypeDetectorComponent, {
      width: '100%'
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog closed with result:', result);
    });
  }

  /**
   * Handles changes in the hashTypeId form control and adjusts form values accordingly.
   *
   * @param {any} hashTypeId - The new value of the hashTypeId form control.
   * @returns {void}
   */
  handleSelectedItems(hashTypeId: any): void {
    const filter = this.hashtypes.filter((u) => u._id === hashTypeId);
    const salted = filter.length > 0 ? filter[0]['isSalted'] : false;

    if (hashTypeId === 2500 || hashTypeId === 16800 || hashTypeId === 16801) {
      this.form.patchValue({
        format: Number(1),
        isSalted: salted
      });
    } else {
      this.form.patchValue({
        isSalted: salted
      });
    }
  }
}
