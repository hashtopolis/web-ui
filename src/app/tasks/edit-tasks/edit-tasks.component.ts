import { Component, OnInit, OnDestroy, HostListener, ViewChild } from '@angular/core';
import { faHomeAlt, faPlus, faTrash} from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormGroup, FormBuilder, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { environment } from './../../../environments/environment';
import { Observable, Subject } from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { TasksService } from '../../core/_services/tasks/tasks.sevice';
import { PendingChangesGuard } from 'src/app/core/_guards/pendingchanges.guard';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-edit-tasks',
  templateUrl: './edit-tasks.component.html'
})
export class EditTasksComponent implements OnInit,PendingChangesGuard {

  editMode = false;
  editedTaskIndex: number;
  editedTask: any // Change to Model

  faHome=faHomeAlt;
  isLoading = false;

  constructor(
    private tasksService: TasksService,
    private route:ActivatedRoute,
    private router: Router
  ) { }

  updateForm: FormGroup;
  color: string = '';
  private maxResults = environment.config.prodApiMaxResults

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  ngOnInit(): void {
    this.route.params
    .subscribe(
      (params: Params) => {
        this.editedTaskIndex = +params['id'];
        this.editMode = params['id'] != null;
        this.initForm();
      }
    );

    this.updateForm = new FormGroup({
      'taskId': new FormControl({value: '', disabled: true}),
      'forcePipe': new FormControl({value: '', disabled: true}),
      'skipKeyspace': new FormControl({value: '', disabled: true}),
      'keyspace': new FormControl({value: '', disabled: true}),
      'keyspaceProgress': new FormControl({value: '', disabled: true}),
      'crackerBinaryId': new FormControl({value: '', disabled: true}),
      'chunkSize': new FormControl({value: '', disabled: true}),
      'updateData': new FormGroup({
        'taskName': new FormControl(''),
        'attackCmd': new FormControl(''),
        'notes': new FormControl(''),
        'color': new FormControl(''),
        'chunkTime': new FormControl(''),
        'statusTimer': new FormControl(''),
        'priority': new FormControl(''),
        'maxAgents': new FormControl(''),
        'isCpuTask': new FormControl(''),
        'isSmall': new FormControl(''),
      }),
    });

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

  }

  OnChangeValue(value){
    this.updateForm.patchValue({
      updateData:{color: value}
    });
  }

  onSubmit(){
    if (this.updateForm.valid) {

      this.isLoading = true;

      this.tasksService.updateTask(this.editedTaskIndex,this.updateForm.value['updateData']).subscribe((tasks: any) => {
        const response = tasks;
        console.log(response);
        this.isLoading = false;
          Swal.fire({
            title: "Good job!",
            text: "Task updated!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          this.updateForm.reset(); // success, we reset form
          this.router.navigate(['tasks/show-tasks']);
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

  private initForm() {
    this.isLoading = true;
    if (this.editMode) {
    this.tasksService.getTask(this.editedTaskIndex).subscribe((result)=>{
      this.color = result['color'];
      this.updateForm = new FormGroup({
        'taskId': new FormControl(result['taskId']),
        'forcePipe': new FormControl(result['forcePipe']== true? 'Yes':'No'),
        'skipKeyspace': new FormControl(result['skipKeyspace']),
        'keyspace': new FormControl(result['keyspace']),
        'keyspaceProgress': new FormControl(result['keyspaceProgress']),
        'crackerBinaryId': new FormControl(result['crackerBinaryId']),
        'chunkSize': new FormControl(result['chunkSize']),
        'updateData': new FormGroup({
          'taskName': new FormControl(result['taskName'], Validators.required),
          'attackCmd': new FormControl(result['attackCmd'], Validators.required),
          'notes': new FormControl(result['notes'], Validators.required),
          'color': new FormControl(result['color'], Validators.required),
          'chunkTime': new FormControl(result['chunkTime'], Validators.required),
          'statusTimer': new FormControl(result['statusTimer'], Validators.required),
          'priority': new FormControl(result['priority'], Validators.required),
          'maxAgents': new FormControl(result['maxAgents'], Validators.required),
          'isCpuTask': new FormControl(result['isCpuTask'], Validators.required),
          'isSmall': new FormControl(result['isSmall'], Validators.required),
        }),
      });
      this.isLoading = false;
    });
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
