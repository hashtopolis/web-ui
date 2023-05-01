import { Component, OnInit, ChangeDetectionStrategy ,ChangeDetectorRef, HostListener, ViewChild  } from '@angular/core';
import { faHomeAlt, faPlus, faTrash, faInfoCircle, faLock } from '@fortawesome/free-solid-svg-icons';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { environment } from './../../../environments/environment';
import { ActivatedRoute, Params } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';

import { FilesService } from '../../core/_services/files/files.service';
import { TasksService } from 'src/app/core/_services/tasks/tasks.sevice';
import { CrackerService } from '../../core/_services/config/cracker.service';
import { TooltipService } from '../../core/_services/shared/tooltip.service';
import { ListsService } from '../../core/_services/hashlist/hashlist.service';
import { PreTasksService } from 'src/app/core/_services/tasks/pretasks.sevice';
import { UIConfigService } from 'src/app/core/_services/shared/storage.service';
import { PreprocessorService } from '../../core/_services/config/preprocessors.service';


@Component({
  selector: 'app-import-supertasks',
  templateUrl: './import-supertasks.component.html'
})
export class ImportSupertasksComponent implements OnInit {

  // Loader
  isLoading = false;
  // Config
  private priority = environment.config.tasks.priority;
  private maxAgents = environment.config.tasks.maxAgents;
  private chunkSize = environment.config.tasks.chunkSize;

  faHome=faHomeAlt;
  faPlus=faPlus;
  faTrash=faTrash;
  faInfoCircle=faInfoCircle;
  faLock=faLock;
  color: string = '#fff'

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  copyMode = false;
  editedIndex: number;
  whichView: string;
  prep: any;  // ToDo change to interface
  crackertype: any;  // ToDo change to interface
  crackerversions: any = [];
  createForm: FormGroup

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

  constructor(
    private preprocessorService:PreprocessorService,
    private _changeDetectorRef: ChangeDetectorRef,
    private preTasksService: PreTasksService,
    private crackerService: CrackerService,
    private tooltipService: TooltipService,
    private filesService: FilesService,
    private uiService: UIConfigService,
    private taskService: TasksService,
    private listsService:ListsService,
    private route:ActivatedRoute,
    private router: Router,
  ) { }

  private maxResults = environment.config.prodApiMaxResults;

  ngOnDestroy(){
    this.dtTrigger.unsubscribe();
  }

  // New checkbox
  filesFormArray: Array<any> = [];
  onChange(fileId:number, fileType:number, fileName: string, cmdAttk: number, $target: EventTarget) {
    const isChecked = (<HTMLInputElement>$target).checked;
    if(isChecked && cmdAttk === 0) {
        this.filesFormArray.push(fileId);
        this.OnChangeAttack(fileName, fileType);
        this.createForm.patchValue({files: this.filesFormArray});
    } if (isChecked && cmdAttk === 1) {
        this.OnChangeAttackPrep(fileName, fileType);
    } if (!isChecked && cmdAttk === 0) {
      let index = this.filesFormArray.indexOf(fileId);
      this.filesFormArray.splice(index,1);
      this.createForm.patchValue({files: this.filesFormArray});
      this.OnChangeAttack(fileName, fileType, true);
    } if (!isChecked && cmdAttk === 1) {
      this.OnChangeAttackPrep(fileName, fileType, true);
    }
  }

  OnChangeAttack(item: string, fileType: number, onRemove?: boolean){
    if(onRemove === true){
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

  OnChangeAttackPrep(item: string, fileType: number, onRemove?: boolean){
    if(onRemove === true){
        let currentCmd = this.createForm.get('preprocessorCommand').value;
        let newCmd = item
        if (fileType === 1 ){newCmd = '-r '+ newCmd;}
        newCmd = currentCmd.replace(newCmd,'');
        newCmd = newCmd.replace(/^\s+|\s+$/g, "");
        this.createForm.patchValue({
          preprocessorCommand: newCmd
        });
    } else {
        let currentCmd = this.createForm.get('preprocessorCommand').value;
        let newCmd = item;
        this.validateFile(newCmd);
        if (fileType === 1 ){
          newCmd = '-r '+ newCmd;
        }
        this.createForm.patchValue({
          preprocessorCommand: currentCmd+' '+ newCmd
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

  // Tooltips
  tasktip: any =[]

  ngOnInit(): void {

    this.route.params
    .subscribe(
      (params: Params) => {
        this.editedIndex = +params['id'];
        this.copyMode = params['id'] != null;
      }
    );

   this.tasktip = this.tooltipService.getTaskTooltips();

   this.fetchData();

    this.dtOptions[0] = {
      dom: 'Bfrtip',
      scrollY: "700px",
      scrollCollapse: true,
      paging: false,
      autoWidth: false,
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
      scrollY: "700px",
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
      scrollY: "700px",
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

    this.createForm = new FormGroup({
      'taskName': new FormControl('', [Validators.required]),
      'notes': new FormControl(''),
      'hashlistId': new FormControl('', [Validators.required]),
      'attackCmd': new FormControl(this.uiService.getUIsettings('hashlistAlias').value, [Validators.required, this.forbiddenChars(this.getBanChars())]),
      'priority': new FormControl(null || this.priority,[Validators.required, Validators.pattern("^[0-9]*$")]),
      'maxAgents': new FormControl(null || this.maxAgents),
      'chunkTime': new FormControl(null || Number(this.uiService.getUIsettings('chunktime').value)),
      'statusTimer': new FormControl(null || Number(this.uiService.getUIsettings('statustimer').value)),
      'color': new FormControl(''),
      'isCpuTask': new FormControl(null || false),
      'skipKeyspace': new FormControl(null || 0),
      'crackerBinaryId': new FormControl(null || 1),
      "crackerBinaryTypeId": new FormControl(),
      "isArchived": new FormControl(false),
      'staticChunks': new FormControl(null || 0),
      'chunkSize': new FormControl(null || this.chunkSize),
      'forcePipe': new FormControl(null || false),
      'preprocessorId': new FormControl(null || 0),
      'preprocessorCommand': new FormControl(''),
      'isSmall': new FormControl(null || false),
      'useNewBench': new FormControl(null || true),
      'files': new FormControl('')
    });

    this.patchHashalias();

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

  getValueBchars(): void {
    this.uiService.getUIsettings('blacklistChars').value
  }

  async fetchData() {
    let params = {'maxResults': this.maxResults, 'filter': 'isArchived='+false+''}
    let params_prep = {'maxResults': this.maxResults }
    let params_crack = {'filter': 'crackerBinaryTypeId=1'};
    let params_f = {'maxResults': this.maxResults, 'expand': 'accessGroup'}

    await this.crackerService.getCrackerType().subscribe((crackers: any) => {
      this.crackertype = crackers.values;
    });

    await this.crackerService.getCrackerBinaries(params_crack).subscribe((crackers: any) => {
      this.crackerversions = crackers.values;
      this.createForm.get('crackerBinaryTypeId').setValue(1) //ToDo
    });

    await this.preprocessorService.getPreprocessors(params_prep).subscribe((prep: any) => {
      this.prep = prep.values;
    });

    await this.filesService.getFiles(params_f).subscribe((files: any) => {
      this.allfiles = files.values;
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        setTimeout(() => {
          this.dtTrigger[0].next(null);
          dtInstance.columns.adjust();
        });
     });
    });
  }

  patchHashalias(){
    this.createForm.patchValue({
      attackCmd:this.uiService.getUIsettings('hashlistAlias').value
    });
  }

  active= 0; //Active show first table wordlist

  ngAfterViewInit() {

    setTimeout(() => {
      this.active = 1;
    },2000);
    this.dtTrigger.next(null);

    let params = {'maxResults': this.maxResults};

    this.listsService.getAllhashlists(params).subscribe((hlist: any) => {
      var self = this;
      var response = hlist.values;
      ($("#hashlist") as any).selectize({
        plugins: ['remove_button'],
        valueField: "hashlistId",
        placeholder: "Search hashlist...",
        labelField: "name",
        searchField: ["name"],
        loadingClass: 'Loading...',
        highlight: true,
        onChange: function (value) {
          self.OnChangeHashlist(value);
        },
        render: {
          option: function (item, escape) {
            return '<div  class="hashtype_selectize">' + escape(item.hashlistId) + ' -  ' + escape(item.name) + '</div>';
          },
        },
        onInitialize: function(){
          var selectize = this;
            selectize.addOption(response);
            var selected_items = [];
            $.each(response, function( i, obj) {
                selected_items.push(obj.id);
            });
            selectize.setValue(selected_items);
          }
          });
      });

  }

  OnChangeValue(value){
    this.createForm.patchValue({
      color: value
    });
    this._changeDetectorRef.detectChanges();
  }

  OnChangeHashlist(value){
    this.createForm.patchValue({
      hashlistId: Number(value)
    });
    this._changeDetectorRef.detectChanges();
  }

  onChangeBinary(id: string){
    let params = {'filter': 'crackerBinaryTypeId='+id+''};
    this.crackerService.getCrackerBinaries(params).subscribe((crackers: any) => {
      this.crackerversions = crackers.values;
      // this.createForm.get('crackerBinaryTypeId').setValue(this.crackerversions.slice(-1)[0] ) // Auto select the latest version
    });
  }

  onSubmit(){
    if (this.createForm.valid) {

      this.isLoading = true;

      this.taskService.createTask(this.createForm.value).subscribe((hasht: any) => {
        const response = hasht;
        this.isLoading = false;
          Swal.fire({
            title: "Good job!",
            text: "New Task created!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          this.createForm.reset(); // success, we reset form
          this.router.navigate(['tasks/show-tasks']);
          // this.router.navigate(['config/engine/crackers']);
        },
        errorMessage => {
          // check error status code is 500, if so, do some action
          Swal.fire({
            title: "Error!",
            text: "Task was not created, please try again!",
            icon: "warning",
            showConfirmButton: true
          });
        }
      );
    }
  }

  private initFormt() {
    this.isLoading = true;
    if (this.copyMode) {
    this.taskService.getTask(this.editedIndex).subscribe((result)=>{
      this.createForm = new FormGroup({
        'taskName': new FormControl(result['taskName']+'_(Copied_task_id_'+this.editedIndex+')', [Validators.required, Validators.minLength(1)]),
        'notes': new FormControl('Copied from task id'+this.editedIndex+'', Validators.required),
        'hashlistId': new FormControl('', [Validators.required]),
        'attackCmd': new FormControl(result['attackCmd'], [Validators.required, this.forbiddenChars(/[&*;$()\[\]{}'"\\|<>\/]/)]),
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
        'skipKeyspace': new FormControl(null || 0),
        'crackerBinaryId': new FormControl(null || 1),
        "isArchived": new FormControl(false),
        'staticChunks': new FormControl(null || 0),
        'chunkSize': new FormControl(null || this.chunkSize),
        'forcePipe': new FormControl(null || false),
        'preprocessorId': new FormControl(null || false),
        'preprocessorCommand': new FormControl(''),
        'files': new FormControl(result['files'], Validators.required),
      });
      this.isLoading = false;
    });
   }
  }

  private initFormpt() {
    this.isLoading = true;
    if (this.copyMode) {
    this.preTasksService.getPretask(this.editedIndex).subscribe((result)=>{
      this.createForm = new FormGroup({
        'taskName': new FormControl(result['taskName']+'_(Copied_pretask_id_'+this.editedIndex+')', [Validators.required, Validators.minLength(1)]),
        'notes': new FormControl('Copied from pretask id'+this.editedIndex+'', Validators.required),
        'hashlistId': new FormControl('', [Validators.required]),
        'attackCmd': new FormControl(result['attackCmd'], [Validators.required, this.forbiddenChars(/[&*;$()\[\]{}'"\\|<>\/]/)]),
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
        'skipKeyspace': new FormControl(null || 0),
        'crackerBinaryId': new FormControl(null || 1),
        "isArchived": new FormControl(false),
        'staticChunks': new FormControl(null || 0),
        'chunkSize': new FormControl(null || this.chunkSize),
        'forcePipe': new FormControl(null || false),
        'preprocessorId': new FormControl(null || false),
        'preprocessorCommand': new FormControl(''),
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

  // @HostListener allows us to also guard against browser refresh, close, etc.
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (!this.canDeactivate()) {
      $event.returnValue = "IE and Edge Message";
    }
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.createForm.valid) {
    return false;
    }
    return true;
  }

}
