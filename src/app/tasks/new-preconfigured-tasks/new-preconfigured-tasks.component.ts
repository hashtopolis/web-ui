import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faInfoCircle, faLock } from '@fortawesome/free-solid-svg-icons';
import { environment } from './../../../environments/environment';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Subject } from 'rxjs';

import { UIConfigService } from 'src/app/core/_services/shared/storage.service';
import { PreTasksService } from '../../core/_services/tasks/pretasks.sevice';
import { CrackerService } from '../../core/_services/config/cracker.service';
import { UsersService } from 'src/app/core/_services/users/users.service';
import { TasksService } from 'src/app/core/_services/tasks/tasks.sevice';
import { FilesService } from '../../core/_services/files/files.service';
import { FileTypePipe } from 'src/app/core/_pipes/file-type.pipe';

declare let $:any;

@Component({
  selector: 'app-new-preconfigured-tasks',
  templateUrl: './new-preconfigured-tasks.component.html'
})
export class NewPreconfiguredTasksComponent implements OnInit,AfterViewInit {
  @ViewChild('cmdAttack', {static: true}) cmdAttack: any;
  // Loader
  isLoading = false;
  faInfoCircle=faInfoCircle;
  faLock=faLock;
  // Config
  private maxResults = environment.config.prodApiMaxResults
  private priority = environment.config.tasks.priority;
  private maxAgents = environment.config.tasks.maxAgents;

  constructor(
    private preTasksService: PreTasksService,
    private crackerService: CrackerService,
    private filesService: FilesService,
    private uiService: UIConfigService,
    private taskService: TasksService,
    private modalService: NgbModal,
    private fileType: FileTypePipe,
    private route:ActivatedRoute,
    private users: UsersService,
    private router: Router,
  ) { }

  copyMode = false;
  editedIndex: number;
  whichView: string;
  createForm: FormGroup
  crackertype: any
  color: string = '#fff'

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  // ToDo change to interface
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

  ngOnDestroy(){
    this.dtTrigger.unsubscribe();
  }

  // New checkbox
  filesFormArray: Array<any> = [];
  onChange(fileId:number, fileType:number, fileName: string, $target: EventTarget) {
    const isChecked = (<HTMLInputElement>$target).checked;
    if(isChecked) {
      this.filesFormArray.push(fileId);
      this.OnChangeAttack(fileName, fileType);
      this.createForm.patchValue({files: this.filesFormArray });
    } else {
      let index = this.filesFormArray.indexOf(fileId);
      this.filesFormArray.splice(index,1);
      this.createForm.patchValue({files: this.filesFormArray});
      this.OnChangeAttack(fileName, fileType, true);
    }
  }

  OnChangeAttack(item: string, fileType: number, onRemove?: boolean){
    if(onRemove == true){
      let currentCmd = this.createForm.get('attackCmd').value;
      let newCmd = item
      if (fileType === 1 ){newCmd = '-r '+ newCmd;}
      newCmd = currentCmd.replace(newCmd,'');
      newCmd = newCmd.replace(/^\s+|\s+$/g, "");
      this.createForm.patchValue({
        attackCmd: newCmd
      });
    } else {
      let currentCmd = this.createForm.get('attackCmd').value;
      let newCmd = item;
      this.validateFile(newCmd);
      if (fileType === 1 ){
        newCmd = '-r '+ newCmd;
      }
      this.createForm.patchValue({
        attackCmd: currentCmd+' '+ newCmd
      });
    }
  }

  validateFile(value){
    if(value.split('.').pop() == '7zip'){
      Swal.fire({
        title: "Heads Up!",
        text: "Hashcat has some issues loading 7z files. Better convert it to a hash file ;)",
        icon: "warning",
      })
    }
  }


  ngOnInit(): void {

    this.setAccessPermissions();

    this.route.params
    .subscribe(
      (params: Params) => {
        this.editedIndex = +params['id'];
        this.copyMode = params['id'] != null;
      }
    );

    this.route.data.subscribe(data => {
      switch (data['kind']) {

        case 'new-preconfigured-tasks':
          this.whichView = 'create';
        break;

        case 'copy-preconfigured-tasks':
          this.whichView = 'edit';
          this.isLoading = true;
          this.initForm();
        break;

        case 'copy-tasks':
          this.whichView = 'task';
          this.isLoading = true;
          this.initFormt();
        break;

      }
    });

    this.createForm = new FormGroup({
      'taskName': new FormControl('', [Validators.required]),
      'attackCmd': new FormControl(this.uiService.getUIsettings('hashlistAlias').value, [Validators.required, this.forbiddenChars(this.getBanChars())]),
      'maxAgents': new FormControl(null || this.maxAgents),
      'chunkTime': new FormControl(null || Number(this.uiService.getUIsettings('chunktime').value)),
      'statusTimer': new FormControl(null || Number(this.uiService.getUIsettings('statustimer').value)),
      'priority': new FormControl(0),
      'color': new FormControl(''),
      'isCpuTask': new FormControl(null || false),
      "crackerBinaryTypeId": new FormControl(null || 1),
      'isSmall': new FormControl(null || false),
      'useNewBench': new FormControl(null || true),
      'isMaskImport': new FormControl(false),
      'files': new FormControl('' || [])
    });

    this.crackerService.getCrackerType().subscribe((crackers: any) => {
      this.crackertype = crackers.values;
    });

    let params = {'maxResults': this.maxResults, 'expand': 'accessGroup'}

    this.filesService.getFiles(params).subscribe((files: any) => {
      this.allfiles = files.values;
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        setTimeout(() => {
          this.dtTrigger[0].next(null);
          dtInstance.columns.adjust();
        });
     });
    });


    this.dtOptions[0] = {
      dom: 'Bfrtip',
      scrollY: "1000px",
      scrollCollapse: true,
      paging: false,
      // destroy: true,
      buttons: {
          dom: {
            button: {
              className: 'dt-button buttons-collection btn btn-sm-dt btn-outline-gray-600-dt',
            }
          },
      buttons:[]
      }
    }

    this.dtOptions[1] = {
      dom: 'Bfrtip',
      scrollY: "1000px",
      scrollCollapse: true,
      paging: false,
      destroy: true,
      buttons: {
          dom: {
            button: {
              className: 'dt-button buttons-collection btn btn-sm-dt btn-outline-gray-600-dt',
            }
          },
      buttons:[]
      }
    }

    this.dtOptions[2] = {
      dom: 'Bfrtip',
      scrollY: "1000px",
      scrollCollapse: true,
      paging: false,
      destroy: true,
      buttons: {
          dom: {
            button: {
              className: 'dt-button buttons-collection btn btn-sm-dt btn-outline-gray-600-dt',
            }
          },
      buttons:[]
      }
    }

  }

  // Set permissions
  createPretaskAccess: any;

  setAccessPermissions(){
    this.users.getUser(this.users.userId,{'expand':'globalPermissionGroup'}).subscribe((perm: any) => {
        this.createPretaskAccess = perm.globalPermissionGroup.permissions.createPretaskAccess;
    });
  }

  get attckcmd(){
    return this.createForm.controls['attackCmd'];
  };

  forbiddenChars(name: RegExp): ValidatorFn{
    return (control: AbstractControl): { [key: string]: any } => {
      const forbidden = name.test(control.value);
      return forbidden ? { 'forbidden' : { value: control.value } } : null;
    };
  }

  onRemoveFChars(){
    let currentCmd = this.createForm.get('attackCmd').value;
    currentCmd = currentCmd.replace(this.getBanChars(),'');
    this.createForm.patchValue({
      attackCmd: currentCmd
    });
  }

  getBanChars(){
    var chars = this.uiService.getUIsettings('blacklistChars').value.replace(']', '\\]').replace('[', '\\[');
    return new RegExp('['+chars+'\/]', "g")
  }

  getBanChar(){
    return this.uiService.getUIsettings('blacklistChars').value;
  }

  // Patch Color DOM value
  OnChangeValue(value){
    this.createForm.patchValue({
      color: value
    });
    // this._changeDetectorRef.detectChanges();
  }

  onSubmit(){
    if(this.createPretaskAccess || typeof this.createPretaskAccess == 'undefined'){
    if (this.createForm.valid) {

      this.isLoading = true;

      this.preTasksService.createPretask(this.createForm.value).subscribe((pret: any) => {
        const response = pret;
        console.log(response);
        this.isLoading = false;
          Swal.fire({
            title: "Good job!",
            text: "New PreTask created!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          this.createForm.reset(); // success, we reset form
        },
        errorMessage => {
          // check error status code is 500, if so, do some action
          Swal.fire({
            title: "Error!",
            text: "PreTask was not created, please try again!",
            icon: "warning",
            showConfirmButton: true
          });
        }
      );
    }
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

  public matchFileType: any
  active= 0; //Active show first table wordlist

  ngAfterViewInit() {

    setTimeout(() => {
      this.active =1;
    },1000);
    this.dtTrigger[0].next(null);

  }

  private initForm() {
    this.isLoading = true;
    if (this.copyMode) {
    this.preTasksService.getPretask(this.editedIndex).subscribe((result)=>{
      this.createForm = new FormGroup({
        'taskName': new FormControl(result['taskName']+'_(Copied_pretask_id_'+this.editedIndex+')', [Validators.required, Validators.minLength(1)]),
        'attackCmd': new FormControl(result['attackCmd']),
        'maxAgents': new FormControl(result['maxAgents'], Validators.required),
        'chunkTime': new FormControl(result['chunkTime'], Validators.required),
        'statusTimer': new FormControl(result['statusTimer'], Validators.required),
        'priority': new FormControl(result['priority'], Validators.required),
        'color': new FormControl(result['color'], Validators.required),
        'isCpuTask': new FormControl(result['isCpuTask'], Validators.required),
        'crackerBinaryTypeId': new FormControl(result['crackerBinaryTypeId'], Validators.required),
        'isSmall': new FormControl(result['isSmall'], Validators.required),
        'useNewBench': new FormControl(result['useNewBench'], Validators.required),
        'isMaskImport': new FormControl(result['isMaskImport'], Validators.required),
        'files': new FormControl(result['files'], Validators.required),
      });
      this.isLoading = false;
    });
   }
  }

  private initFormt() {
    this.isLoading = true;
    if (this.copyMode) {
    this.taskService.getTask(this.editedIndex).subscribe((result)=>{
      this.createForm = new FormGroup({
        'taskName': new FormControl(result['taskName']+'_(Copied_pretask_from_task_id_'+this.editedIndex+')', [Validators.required, Validators.minLength(1)]),
        'attackCmd': new FormControl(result['attackCmd']),
        'maxAgents': new FormControl(result['maxAgents'], Validators.required),
        'chunkTime': new FormControl(result['chunkTime'], Validators.required),
        'statusTimer': new FormControl(result['statusTimer'], Validators.required),
        'priority': new FormControl(result['priority'], Validators.required),
        'color': new FormControl(result['color'], Validators.required),
        'isCpuTask': new FormControl(result['isCpuTask'], Validators.required),
        'crackerBinaryTypeId': new FormControl(result['crackerBinaryTypeId'], Validators.required),
        'isSmall': new FormControl(result['isSmall'], Validators.required),
        'useNewBench': new FormControl(result['useNewBench'], Validators.required),
        'isMaskImport': new FormControl(result['isMaskImport'], Validators.required),
        'files': new FormControl(result['files'], Validators.required),
      });
      this.isLoading = false;
    });
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

  // Navigation Modals

  navChanged(event) {
    console.log('navChanged', event);
  }

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
