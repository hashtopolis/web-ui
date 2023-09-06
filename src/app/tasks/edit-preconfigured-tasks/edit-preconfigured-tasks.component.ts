import { faHomeAlt, faPlus, faTrash, faInfoCircle, faEye, faLock} from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit, ViewChild, HostListener   } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { GlobalService } from 'src/app/core/_services/main.service';
import { colorpicker } from '../../core/_constants/settings.config';
import { environment } from './../../../environments/environment';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../core/_services/main.config';

@Component({
  selector: 'app-edit-preconfigured-tasks',
  templateUrl: './edit-preconfigured-tasks.component.html'
})
@PageTitle(['Edit Preconfigured Tasks'])
export class EditPreconfiguredTasksComponent implements OnInit{

  editMode = false;
  editedPretaskIndex: number;
  editedPretask: any // Change to Model

  faInfoCircle=faInfoCircle;
  faHome=faHomeAlt;
  faTrash=faTrash;
  faPlus=faPlus;
  faLock=faLock;
  faEye=faEye;

  constructor(
    private route:ActivatedRoute,
    private gs: GlobalService,
    private router: Router
  ) { }

  pretask: any = [];
  color = '';
  colorpicker=colorpicker;
  updateForm: FormGroup
  private maxResults = environment.config.prodApiMaxResults

  // Table Files
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  files: any //Add Model

  ngOnInit(): void {

    this.route.params
    .subscribe(
      (params: Params) => {
        this.editedPretaskIndex = +params['id'];
        this.editMode = params['id'] != null;
        this.initForm();
      }
    );

    this.updateForm = new FormGroup({
      'pretaskId': new FormControl({value: '', disabled: true}),
      'statusTimer': new FormControl({value: '', disabled: true}),
      'useNewBench': new FormControl({value: '', disabled: true}),
      'updateData': new FormGroup({
        'taskName': new FormControl(''),
        'attackCmd': new FormControl(''),
        'chunkTime': new FormControl(''),
        'color': new FormControl(''),
        'priority': new FormControl(''),
        'maxAgents': new FormControl(''),
        'isCpuTask': new FormControl(''),
        'isSmall': new FormControl(''),
      }),
    });

    // Files Table

    const params = {
      'maxResults': this.maxResults,
      'filter': 'pretaskId='+this.editedPretaskIndex+'',
      'expand': 'pretaskFiles'
    }

    this.gs.getAll(SERV.PRETASKS,params).subscribe((pretasks: any) => {
      this.files = pretasks.values;
      this.dtTrigger.next(void 0);
    });

    this.dtOptions = {
      dom: 'Bfrtip',
      scrollX: true,
      pageLength: 10,
      stateSave: true,
      select: true,
      buttons: [ ]
    };

  }

  OnChangeValue(value){
    this.updateForm.patchValue({
      updateData:{color: value}
    });
  }

  onSubmit(){
    if (this.updateForm.valid) {

      this.gs.update(SERV.PRETASKS,this.editedPretaskIndex,this.updateForm.value['updateData']).subscribe(() => {
          Swal.fire({
            title: "Success",
            text: "Pretask updated!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          this.updateForm.reset(); // success, we reset form
          this.router.navigate(['tasks/preconfigured-tasks']);
        }
      );
    }
  }

  private initForm() {
    if (this.editMode) {
    this.gs.get(SERV.PRETASKS,this.editedPretaskIndex).subscribe((result)=>{
      this.pretask = result;
      this.color = result['color'];
      this.updateForm = new FormGroup({
        'pretaskId': new FormControl({value:  result['pretaskId'], disabled: true}),
        'statusTimer': new FormControl({value: result['statusTimer'], disabled: true}),
        'useNewBench': new FormControl({value: result['useNewBench'], disabled: true}),
        'updateData': new FormGroup({
          'taskName': new FormControl(result['taskName'], Validators.required),
          'attackCmd': new FormControl(result['attackCmd'], Validators.required),
          'chunkTime': new FormControl(result['chunkTime']),
          'color': new FormControl(result['color']),
          'priority': new FormControl(result['priority']),
          'maxAgents': new FormControl(result['maxAgents']),
          'isCpuTask': new FormControl(result['isCpuTask'], Validators.required),
          'isSmall': new FormControl(result['isSmall'], Validators.required),
        }),
      });
    });
   }
  }

  getFileEdit(value:any){
    if(value == 0){
      return 'wordlist-edit';
    } if(value == 1){
      return 'rules-edit';
    } if(value == 2){
      return 'other-edit';
    } else{
      return 'error';
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
      if (this.updateForm.valid) {
      return false;
      }
      return true;
    }

}
