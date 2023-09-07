import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { environment } from './../../../../environments/environment';
import { faInfoCircle, faLock } from '@fortawesome/free-solid-svg-icons';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {  Observable, Subject } from 'rxjs';

import { UIConfigService } from 'src/app/core/_services/shared/storage.service';
import { TooltipService } from '../../../core/_services/shared/tooltip.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../../core/_services/main.config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wrbulk',
  templateUrl: './wrbulk.component.html'
})
@PageTitle(['Import SuperTask - Wordlist/Rules Bulk'])
export class WrbulkComponent implements OnInit {

  faInfoCircle=faInfoCircle;
  faLock=faLock;

  createForm: FormGroup;
  crackertype: any;
  allfiles: any;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private tooltipService: TooltipService,
    private uiService: UIConfigService,
    private gs: GlobalService,
    private router: Router,
  ) { }

  private maxResults = environment.config.prodApiMaxResults;

  ngOnInit(): void {

    this.fetchData();

    this.dtOptions = {
      dom: 'Bfrtip',
      scrollX: true,
      pageLength: 25,
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

    this.createForm = new FormGroup({
      'name': new FormControl('', [Validators.required]),
      'isSmall': new FormControl(''),
      'isCPU': new FormControl(''),
      'useBench': new FormControl(''),
      'crackerBinaryId': new FormControl(''),
      'attackCmd': new FormControl(this.uiService.getUIsettings('hashlistAlias').value, [Validators.required, this.forbiddenChars(this.getBanChars())]),
      'files': new FormControl('')
    });

    this.patchHashalias();

  }

  onSubmit(){

  }

  async fetchData() {
    const params = {'maxResults': this.maxResults, 'expand': 'accessGroup'};

    await this.gs.getAll(SERV.CRACKERS_TYPES).subscribe((crackers: any) => {
      this.crackertype = crackers.values;
    });

    await this.gs.getAll(SERV.FILES,params).subscribe((files: any) => {
      this.allfiles = files.values;
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        setTimeout(() => {
          this.dtTrigger.next(null);
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
      const index = this.filesFormArray.indexOf(fileId);
      this.filesFormArray.splice(index,1);
      this.createForm.patchValue({files: this.filesFormArray});
      this.OnChangeAttack(fileName, fileType, true);
    } if (!isChecked && cmdAttk === 1) {
      this.OnChangeAttackPrep(fileName, fileType, true);
    }
  }

  OnChangeAttack(item: string, fileType: number, onRemove?: boolean){
    if(onRemove === true){
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

  OnChangeAttackPrep(item: string, fileType: number, onRemove?: boolean){
    if(onRemove === true){
        const currentCmd = this.createForm.get('preprocessorCommand').value;
        let newCmd = item
        if (fileType === 1 ){newCmd = '-r '+ newCmd;}
        newCmd = currentCmd.replace(newCmd,'');
        newCmd = newCmd.replace(/^\s+|\s+$/g, "");
        this.createForm.patchValue({
          preprocessorCommand: newCmd
        });
    } else {
        const currentCmd = this.createForm.get('preprocessorCommand').value;
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
    const chars = this.uiService.getUIsettings('blacklistChars').value.replace(']', '\\]').replace('[', '\\[');
    return new RegExp('['+chars+'\/]', "g")
  }

  getBanChar(){
    return this.uiService.getUIsettings('blacklistChars').value;
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

  getValueBchars(): void {
    this.uiService.getUIsettings('blacklistChars').value
  }

  ngOnDestroy(){
    this.dtTrigger.unsubscribe();
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
