import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faInfoCircle, faLock } from '@fortawesome/free-solid-svg-icons';
import { environment } from './../../../environments/environment';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Subject } from 'rxjs';

import { UIConfigService } from 'src/app/core/_services/shared/storage.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { colorpicker } from '../../core/_constants/settings.config';
import { FileTypePipe } from 'src/app/core/_pipes/file-type.pipe';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../core/_services/main.config';

@Component({
  selector: 'app-new-preconfigured-tasks',
  templateUrl: './new-preconfigured-tasks.component.html'
})
@PageTitle(['New Preconfigured Tasks'])
export class NewPreconfiguredTasksComponent implements OnInit,AfterViewInit {
  @ViewChild('cmdAttack', {static: true}) cmdAttack: any;

  faInfoCircle=faInfoCircle;
  faLock=faLock;
  // Config
  private maxResults = environment.config.prodApiMaxResults
  private priority = environment.config.tasks.priority;
  private maxAgents = environment.config.tasks.maxAgents;

  constructor(
    private uiService: UIConfigService,
    private modalService: NgbModal,
    private fileType: FileTypePipe,
    private route:ActivatedRoute,
    private gs: GlobalService,
    private router: Router
  ) { }

  copyMode = false;
  editedIndex: number;
  whichView: string;
  createForm: FormGroup
  crackertype: any
  color: any;
  colorpicker=colorpicker;

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
      if (this.copyMode) {
        this.filesFormArray = this.createForm.get('files').value;
      }
      this.filesFormArray.push(fileId);
      this.OnChangeAttack(fileName, fileType);
      this.createForm.patchValue({files: this.filesFormArray });
    } else {
      if (this.copyMode) {
        this.filesFormArray = this.createForm.get('files').value;
      }
      const index = this.filesFormArray.indexOf(fileId);
      this.filesFormArray.splice(index,1);
      this.createForm.patchValue({files: this.filesFormArray});
      this.OnChangeAttack(fileName, fileType, true);
    }
  }

  onChecked(fileId: number){
    return this.createForm.get('files').value.includes(fileId);
  }

  OnChangeAttack(item: string, fileType: number, onRemove?: boolean){
    if(onRemove == true){
      const currentCmd = this.createForm.get('attackCmd').value;
      let newCmd = item
      if (fileType === 1 ){newCmd = '-r '+ newCmd;}
      newCmd = currentCmd.replace(newCmd,'');
      newCmd = newCmd.replace(/^\s+|\s+$/g, "");
      this.createForm.patchValue({
        attackCmd: newCmd
      });
    } else {
      const currentCmd = this.createForm.get('attackCmd').value;
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
          this.initForm();
        break;

        case 'copy-tasks':
          this.whichView = 'task';
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

    this.gs.getAll(SERV.CRACKERS_TYPES).subscribe((crackers: any) => {
      this.crackertype = crackers.values;
    });

    const params = {'maxResults': this.maxResults, 'expand': 'accessGroup'}

    this.gs.getAll(SERV.FILES,params).subscribe((files: any) => {
      this.allfiles = files.values;
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        setTimeout(() => {
          this.dtTrigger[0].next(null);
          dtInstance.columns.adjust();
        });
     });
    });


    this.dtOptions = {
      dom: 'Bfrtip',
      scrollX: true,
      pageLength: 25,
      lengthMenu: [
          [10, 25, 50, 100, 250, -1],
          [10, 25, 50, 100, 250, 'All']
      ],
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

  }

  get attckcmd(){
    return this.createForm.controls['attackCmd'];
  }

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
    const chars = this.uiService.getUIsettings('blacklistChars').value.replace(']', '\\]').replace('[', '\\[');
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
    if (this.createForm.valid) {

      this.gs.create(SERV.PRETASKS,this.createForm.value).subscribe(() => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: "Success!",
            text: "New PreTask created!",
            showConfirmButton: false,
            timer: 1500
          })
          this.createForm.reset(); // success, we reset form
          this.router.navigate(['tasks/preconfigured-tasks']);
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
    if (this.copyMode) {
    this.gs.get(SERV.PRETASKS,this.editedIndex, {'expand':'pretaskFiles'}).subscribe((result)=>{
      this.color = result['color'];
      const arrFiles: Array<any> = [];
      if(result['pretaskFiles']){
        for(let i=0; i < result['pretaskFiles'].length; i++){
          arrFiles.push(result['pretaskFiles'][i]['fileId']);
        }
      }
      this.createForm = new FormGroup({
        'taskName': new FormControl(result['taskName']+'_(Copied_pretask_id_'+this.editedIndex+')', [Validators.required, Validators.minLength(1)]),
        'attackCmd': new FormControl(result['attackCmd']),
        'maxAgents': new FormControl(result['maxAgents']),
        'chunkTime': new FormControl(result['chunkTime']),
        'statusTimer': new FormControl(result['statusTimer']),
        'priority': new FormControl(result['priority']),
        'color': new FormControl(result['color']),
        'isCpuTask': new FormControl(result['isCpuTask']),
        'crackerBinaryTypeId': new FormControl(result['crackerBinaryTypeId']),
        'isSmall': new FormControl(result['isSmall']),
        'useNewBench': new FormControl(result['useNewBench']),
        'isMaskImport': new FormControl(false),
        'files': new FormControl(arrFiles),
      });
    });
   }
  }

  private initFormt() {
    if (this.copyMode) {
    this.gs.get(SERV.TASKS,this.editedIndex,{'expand': 'files'}).subscribe((result)=>{
      this.color = result['color'];
      const arrFiles: Array<any> = [];
      if(result.files){
        for(let i=0; i < result.files.length; i++){
          arrFiles.push(result.files[i]['fileId']);
        }
      }
      this.createForm = new FormGroup({
        'taskName': new FormControl(result['taskName']+'_(Copied_pretask_from_task_id_'+this.editedIndex+')', [Validators.required, Validators.minLength(1)]),
        'attackCmd': new FormControl(result['attackCmd']),
        'maxAgents': new FormControl(result['maxAgents']),
        'chunkTime': new FormControl(result['chunkTime']),
        'statusTimer': new FormControl(result['statusTimer']),
        'priority': new FormControl(result['priority']),
        'color': new FormControl(result['color']),
        'isCpuTask': new FormControl(result['isCpuTask']),
        'crackerBinaryTypeId': new FormControl(result['crackerBinaryTypeId']),
        'isSmall': new FormControl(result['isSmall']),
        'useNewBench': new FormControl(result['useNewBench']),
        'isMaskImport': new FormControl(false),
        'files': new FormControl(arrFiles),
      });
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
