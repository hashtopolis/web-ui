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

  faEye=faEye;
  faHome=faHomeAlt;
  faInfoCircle=faInfoCircle;

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  constructor(
    private format: StaticArrayPipe,
    private route: ActivatedRoute,
    private gs: GlobalService,
    private router: Router
  ) { }

  updateForm: FormGroup
  accessgroup: any //Change to Interface
  alltasks: any; //Change to Interface
  loadchunks: any; //Change to Interface
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
          this.router.navigate(['/hashlists/hashlist']);
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
    this.gs.get(SERV.HASHLISTS,this.editedHashlistIndex).subscribe((result)=>{
        this.getTasks();
        this.getHashtype();
        this.editedHashlist = result;
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

    });
   }
  }

  hashT: any;
  getHashtype(){
    const params = {'maxResults': this.maxResults, 'expand': 'hashlist', 'filter': 'taskId='+this.editedHashlistIndex+''}
    const paramsh = {'maxResults': this.maxResults};
    const matchObject =[]
    this.gs.getAll(SERV.TASKS,params).subscribe((tasks: any) => {
      this.gs.getAll(SERV.HASHTYPES,paramsh).subscribe((htypes: any) => {
        this.hashT = tasks.values.map(mainObject => {
          matchObject.push(htypes.values.find((element:any) => element.hashTypeId === mainObject.hashlist.hashTypeId))
        return { ...mainObject, ...matchObject }
        })
      })
    })
  }

  getTasks():void {
    const params = {'maxResults': this.maxResults, 'expand': 'crackerBinary,crackerBinaryType,hashlist', 'filter': 'isArchived=false'}
    const taskh = []
    this.gs.getAll(SERV.TASKS,params).subscribe((tasks: any) => {
      for(let i=0; i < tasks.values.length; i++){
        const match = tasks.values[i].hashlist.hashlistId == this.editedHashlistIndex;
        if(match === true){
          taskh.push(tasks.values[i])
        }
      }
      this.alltasks = taskh;
      this.loadChunks();

      this.dtOptions[0] = {
        dom: 'Bfrtip',
        scrollY: "700px",
        scrollCollapse: true,
        paging: false,
        autoWidth: false,
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

      this.dtTrigger.next(null);

    });
  }

  loadChunks(){
    const params = {'maxResults': 999999999};
    this.gs.getAll(SERV.CHUNKS,params).subscribe((c: any)=>{
      this.loadchunks = c;
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
    if (this.updateForm.valid) {
    return false;
      }
    return true;
  }

}


