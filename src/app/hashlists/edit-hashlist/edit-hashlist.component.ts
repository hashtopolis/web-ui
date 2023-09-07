import { faHomeAlt, faInfoCircle, faEye } from '@fortawesome/free-solid-svg-icons';
import { StaticArrayPipe } from 'src/app/core/_pipes/static-array.pipe';
import { Component, HostListener, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Observable, Subject } from 'rxjs';

import { GlobalService } from 'src/app/core/_services/main.service';
import { environment } from './../../../environments/environment';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../core/_services/main.config';

@Component({
  selector: 'app-edit-hashlist',
  templateUrl: './edit-hashlist.component.html'
})
@PageTitle(['Edit Hashlist'])
export class EditHashlistComponent implements OnInit {

  editMode = false;
  editedHashlistIndex: number;
  editedHashlist: any // Change to Model
  hashtype: any;
  type: any // Hashlist or SuperHaslist
  hashlist: any

  faEye=faEye;
  faHome=faHomeAlt;
  faInfoCircle=faInfoCircle;

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtTrigger1: Subject<any> = new Subject<any>();
  dtOptions: any = {};
  dtOptions1: any = {};

  constructor(
    private format: StaticArrayPipe,
    private route: ActivatedRoute,
    private gs: GlobalService,
    private router: Router
  ) { }

  updateForm: FormGroup
  accessgroup: any //Change to Interface
  alltasks: any; //Change to Interface
  private maxResults = environment.config.prodApiMaxResults;


  ngOnInit(): void {
    this.route.params
    .subscribe(
      (params: Params) => {
        this.editedHashlistIndex = +params['id'];
        this.editMode = params['id'] != null;
        this.initForm();
      }
    );

    this.updateForm = new FormGroup({
      'hashlistId': new FormControl({value: '', disabled: true}),
      'accessGroupId': new FormControl(''),
      'hashTypeId': new FormControl({value: '', disabled: true}),
      'useBrain': new FormControl({value: '', disabled: true}),
      'format': new FormControl({value: '', disabled: true}),
      'hashCount': new FormControl({value: '', disabled: true}),
      'cracked': new FormControl({value: '', disabled: true}),
      'remaining': new FormControl({value: '', disabled: true}),
      'updateData': new FormGroup({
        'name': new FormControl(''),
        'notes': new FormControl(''),
        'isSecret': new FormControl(''),
        'accessGroupId': new FormControl(''),
      }),
    });

    this.gs.get(SERV.HASHLISTS,this.editedHashlistIndex).subscribe((result)=>{
      this.editedHashlist = result;
    });

    const params = {'maxResults': this.maxResults};

    this.gs.getAll(SERV.ACCESS_GROUPS, params).subscribe((agroups: any) => {
      this.accessgroup = agroups.values;
    });

  }

  onSubmit(){
    if (this.updateForm.valid) {

      this.gs.update(SERV.HASHLISTS,this.editedHashlistIndex,this.updateForm.value['updateData']).subscribe(() => {
          Swal.fire({
            title: "Success",
            text: "HashList updated!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          this.updateForm.reset(); // success, we reset form
          const path = this.type === 3 ? '/hashlists/superhashlist':'/hashlists/hashlist';
          this.router.navigate([path]);
        }
      );
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

  private initForm() {
    if (this.editMode) {
    this.gs.get(SERV.HASHLISTS,this.editedHashlistIndex,{'expand':'tasks,hashlists,hashType'}).subscribe((result)=>{
        this.getTasks();
        this.editedHashlist = result;
        this.type = result['format'];
        this.hashtype = result['hashType'];
        this.hashlist = result['hashlists'];
        this.updateForm = new FormGroup({
          'hashlistId': new FormControl({value: result['hashlistId'], disabled: true}),
          'accessGroupId': new FormControl({value: result['accessGroupId'], disabled: true}),
          'useBrain': new FormControl({value: result['useBrain'] == true ? 'Yes' : 'No', disabled: true}),
          'format': new FormControl({value: this.format.transform(result['format'],'formats'), disabled: true}),
          'hashCount': new FormControl({value: result['hashCount'], disabled: true}),
          'cracked': new FormControl({value: result['cracked'], disabled: true}),
          'remaining': new FormControl({value: result['hashCount'] - result['cracked'], disabled: true}),
          'updateData': new FormGroup({
            'name': new FormControl(result['name']),
            'notes': new FormControl(result['notes']),
            'isSecret': new FormControl(result['isSecret']),
            'accessGroupId': new FormControl(result['accessGroupId']),
          }),
       });

      this.dtTrigger1.next(null);

      // Display Tasks Expand tasks

    });
   }
    this.dtOptions1 = {
      dom: 'Bfrtip',
      scrollX: true,
      bStateSave:true,
      destroy: true,
      buttons:[]
    }
  }

  // Remove when expand task is working
  getTasks():void {
    const params = {'maxResults': this.maxResults, 'expand': 'crackerBinary,crackerBinaryType,hashlist', 'filter': 'isArchived=false'}
    const taskh = []
    this.gs.getAll(SERV.TASKS,params).subscribe((tasks: any) => {
      for(let i=0; i < tasks.values.length; i++){
        let firtprep = tasks.values[i].hashlist;
        for(let i=0; i < firtprep.length; i++){
          const match = firtprep[i].hashlistId == this.editedHashlistIndex;
          if(match === true){
            taskh.push(tasks.values[i])
          }
        }
      }
      this.alltasks = taskh;
      this.dtTrigger.next(null);
    });

    this.dtOptions = {
      dom: 'Bfrtip',
      scrollX: true,
      pageLength: 25,
      bStateSave:true,
      destroy: true,
      buttons:[]
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


