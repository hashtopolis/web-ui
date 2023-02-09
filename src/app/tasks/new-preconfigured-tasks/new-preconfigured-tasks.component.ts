import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { AbstractControl, FormArray, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { faInfoCircle, faLock } from '@fortawesome/free-solid-svg-icons';
import { environment } from './../../../environments/environment';

import { PreTasksService } from '../../core/_services/tasks/pretasks.sevice';
import { CrackerService } from '../../core/_services/config/cracker.service';
import { FilesService } from '../../core/_services/files/files.service';
import { FileTypePipe } from 'src/app/core/_pipes/file-type.pipe';
import { ModalDismissReasons, NgbModal, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TasksService } from 'src/app/core/_services/tasks/tasks.sevice';

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
  private chunkTime = environment.config.tasks.chunkTime;
  private statusTimer = environment.config.tasks.statusTimer;

  constructor(
    private taskService: TasksService,
    private preTasksService: PreTasksService,
    private crackerService: CrackerService,
    private filesService: FilesService,
    private modalService: NgbModal,
    private route:ActivatedRoute,
    private router: Router,
    private fileType: FileTypePipe
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
      console.log(this.filesFormArray)
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
      'attackCmd': new FormControl(null || '#HL#', [Validators.required, this.forbiddenChars(/[&*;$()\[\]{}'"\\|<>\/]/)]),
      'maxAgents': new FormControl(null || this.maxAgents),
      'chunkTime': new FormControl(null || this.chunkTime),
      'statusTimer': new FormControl(null || this.statusTimer),
      'priority': new FormControl(0),
      'color': new FormControl(''),
      'isCpuTask': new FormControl(null || false),
      "crackerBinaryTypeId": new FormControl(null || 1),
      'isSmall': new FormControl(null || false),
      'useNewBench': new FormControl(null || true),
      'isMaskImport': new FormControl(false),
      'files': new FormControl('')
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
    const forbidden = /[&*;$()\[\]{}'"\\|<>\/]/g;
    let currentCmd = this.createForm.get('attackCmd').value;
    currentCmd = currentCmd.replace(forbidden,'');
    this.createForm.patchValue({
      attackCmd: currentCmd
    });
  }

  // Path Color DOM value
  OnChangeValue(value){
    this.createForm.patchValue({
      color: value
    });
    // this._changeDetectorRef.detectChanges();
  }

  onSubmit(){
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

  // Modal Information
    attackmode =[
      {'value': '0', 'name': 'Straight(Using rules)' },
      {'value': '1', 'name': 'Combination' },
      {'value': '3', 'name': 'Brute-force'},
      {'value': '6', 'name': 'Hybrid Dictionary+ Mask'},
      {'value': '7', 'name': 'Hybrid Mask + Dictionary'},
    ]

    attackex =[
      {'value': 'Dictionary', 'example': '-w3 -O #HL# -a 0 rockyou.txt' },
      {'value': 'Dictionary + Rules', 'example': '-w3 -O #HL# -a 0 rockyou.txt -r base64rule.txt' },
      {'value': 'Combination', 'example': '-w3 -O #HL# -a 1 rockyou.txt rockyou2.txt'},
      {'value': 'Hybrid Dictionary + Mask', 'example': '-w3 -O #HL# -a 6 -m dict.txt ?a?a?a?a'},
      {'value': 'Hybrid Mask + Dictionary', 'example': '-w3 -O #HL# -a 7 -m ?a?a?a?a dict.txt'},
    ]

    charsets =[
      {'value': '?l', 'descrip': 'abcdefghĳklmnopqrstuvwxyz' },
      {'value': '?u', 'descrip': 'ABCDEFGHĲKLMNOPQRSTUVWXYZ' },
      {'value': '?d', 'descrip': '0123456789' },
      {'value': '?h', 'descrip': '0123456789abcdef' },
      {'value': '?H', 'descrip': '0123456789ABCDEF' },
      {'value': '?s', 'descrip': '«space»!"#$%&()*+,-./:;<=>?@[\]^_`{|}~'},
      {'value': '?a', 'descrip': '?l?u?d?s'},
      {'value': '?b', 'descrip': '0x00 - 0xff'},
    ]

}
