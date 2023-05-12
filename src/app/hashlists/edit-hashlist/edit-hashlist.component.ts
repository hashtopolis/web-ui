import { faHomeAlt, faInfoCircle, faEye } from '@fortawesome/free-solid-svg-icons';
import { StaticArrayPipe } from 'src/app/core/_pipes/static-array.pipe';
import { Component, HostListener, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Observable, Subject } from 'rxjs';

import { environment } from './../../../environments/environment';
import { HashtypeService } from '../../core/_services/config/hashtype.service';
import { TasksService } from 'src/app/core/_services/tasks/tasks.sevice';
import { ListsService } from '../../core/_services/hashlist/hashlist.service';
import { AccessGroupsService } from '../../core/_services/access/accessgroups.service';
import { ChunkService } from 'src/app/core/_services/tasks/chunks.service';
import { UsersService } from 'src/app/core/_services/users/users.service';

@Component({
  selector: 'app-edit-hashlist',
  templateUrl: './edit-hashlist.component.html'
})
export class EditHashlistComponent implements OnInit {

  editMode = false;
  editedHashlistIndex: number;
  editedHashlist: any // Change to Model

  faEye=faEye;
  faHome=faHomeAlt;
  faInfoCircle=faInfoCircle;
  isLoading = false;

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  constructor(
    private accessgroupService:AccessGroupsService,
    private hashtypeService: HashtypeService,
    private chunkService: ChunkService,
    private listsService: ListsService,
    private tasksService: TasksService,
    private format: StaticArrayPipe,
    private route: ActivatedRoute,
    private users: UsersService,
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

    this.listsService.getHashlist(this.editedHashlistIndex).subscribe((result)=>{
      this.editedHashlist = result;
    });

    this.accessgroupService.getAccessGroups().subscribe((agroups: any) => {
      this.accessgroup = agroups.values;
    });

  }

  // Set permissions
  manageHashlistAccess: any;

  setAccessPermissions(){
    this.users.getUser(this.users.userId,{'expand':'globalPermissionGroup'}).subscribe((perm: any) => {
        this.manageHashlistAccess = perm.globalPermissionGroup.permissions.manageHashlistAccess;
    });
  }

  onSubmit(){
    if(this.manageHashlistAccess || typeof this.manageHashlistAccess == 'undefined'){
    if (this.updateForm.valid) {

      this.isLoading = true;

      this.listsService.updateHashlist(this.editedHashlistIndex,this.updateForm.value['updateData']).subscribe((hasht: any) => {
        const response = hasht;
        console.log(response);
        this.isLoading = false;
          Swal.fire({
            title: "Good job!",
            text: "HashList updated!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          this.updateForm.reset(); // success, we reset form
          this.router.navigate(['/hashlists/hashlist']);
        },
        errorMessage => {
          // check error status code is 500, if so, do some action
          Swal.fire({
            title: "Error!",
            text: "HashList was not created, please try again!",
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
    this.isLoading = true;
    if (this.editMode) {
    let params = {'maxResults': this.maxResults};
    this.listsService.getHashlist(this.editedHashlistIndex).subscribe((result)=>{
        this.getTasks();
        this.getHashtype();
        this.editedHashlist = result;
        this.updateForm = new FormGroup({
          'hashlistId': new FormControl(result['hashlistId']),
          'accessGroupId': new FormControl(result['accessGroupId']),
          'useBrain': new FormControl(result['useBrain'] == 0 ? 'Yes' : 'No'),
          'format': new FormControl(this.format.transform(result['format'],'formats')),
          'hashCount': new FormControl(result['hashCount']),
          'cracked': new FormControl(result['cracked']),
          'remaining': new FormControl(result['hashCount'] - result['cracked']),
          'updateData': new FormGroup({
            'name': new FormControl(result['name']),
            'notes': new FormControl(result['notes']),
            'isSecret': new FormControl(result['isSecret']),
            'accessGroupId': new FormControl(result['accessGroupId']),
          }),
       });
       this.isLoading = false;
    });
   }
  }

  hashT: any;
  getHashtype(){
    let params = {'maxResults': this.maxResults, 'expand': 'hashlist', 'filter': 'taskId='+this.editedHashlistIndex+''}
    let paramsh = {'maxResults': this.maxResults};
    var matchObject =[]
    this.tasksService.getAlltasks(params).subscribe((tasks: any) => {
      this.hashtypeService.getHashTypes(paramsh).subscribe((htypes: any) => {
        this.hashT = tasks.values.map(mainObject => {
          matchObject.push(htypes.values.find((element:any) => element.hashTypeId === mainObject.hashlist.hashTypeId))
        return { ...mainObject, ...matchObject }
        })
      })
    })
  }

  getTasks():void {
    let params = {'maxResults': this.maxResults, 'expand': 'crackerBinary,crackerBinaryType,hashlist', 'filter': 'isArchived=false'}
    var taskh = []
    this.tasksService.getAlltasks(params).subscribe((tasks: any) => {
      for(let i=0; i < tasks.values.length; i++){
        let match = tasks.values[i].hashlist.hashlistId == this.editedHashlistIndex;
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
    let params = {'maxResults': 999999999};
    this.chunkService.getChunks(params).subscribe((c: any)=>{
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


