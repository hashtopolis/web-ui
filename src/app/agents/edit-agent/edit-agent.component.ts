import { faAlignJustify, faIdBadge, faComputer, faKey, faInfoCircle, faEye } from '@fortawesome/free-solid-svg-icons';
import { faLinux, faWindows, faApple } from '@fortawesome/free-brands-svg-icons';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from './../../../environments/environment';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Subject } from 'rxjs';

import { UIConfigService } from 'src/app/core/_services/shared/storage.service';
import { ChunkService } from 'src/app/core/_services/tasks/chunks.service';
import { AgentsService } from '../../core/_services/agents/agents.service';
import { TasksService } from 'src/app/core/_services/tasks/tasks.sevice';
import { UsersService } from '../../core/_services/users/users.service';

@Component({
  selector: 'app-edit-agent',
  templateUrl: './edit-agent.component.html'
})
export class EditAgentComponent implements OnInit {
  editMode = false;
  editedAgentIndex: number;
  editedAgent: any // Change to Model

  isLoading = false;

  faAlignJustify=faAlignJustify;
  faInfoCircle=faInfoCircle;
  faComputer=faComputer;
  faIdBadge=faIdBadge;
  faWindows=faWindows;
  faLinux=faLinux;
  faApple=faApple;
  faKey=faKey;
  faEye=faEye;

  constructor(
    private agentsService: AgentsService,
    private usersService: UsersService,
    private uiService: UIConfigService,
    private chunkService: ChunkService,
    private tasksService:TasksService,
    private route:ActivatedRoute,
    private router: Router,
  ) { }

  updateForm: FormGroup
  showagent: any = [];
  users: any = [];
  private maxResults = environment.config.prodApiMaxResults;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};
  uidateformat:any;

  ngOnInit(): void {

    this.setAccessPermissions();

    this.uidateformat = this.uiService.getUIsettings('timefmt').value;

    this.route.params
    .subscribe(
      (params: Params) => {
        this.editedAgentIndex = +params['id'];
        this.editMode = params['id'] != null;
        this.initForm();
        this.assignChunksInit(this.editedAgentIndex);
      }
    );

    this.updateForm = new FormGroup({
      'isActive': new FormControl(''),
      'userId': new FormControl({value: '', disabled: true}),
      'agentName': new FormControl(''),
      'token': new FormControl({value: '', disabled: true}),
      'cpuOnly': new FormControl(),
      'cmdPars': new FormControl(''),
      'ignoreErrors': new FormControl(''),
      'isTrusted': new FormControl('')
    });

    this.isLoading = true;

    const id = +this.route.snapshot.params['id'];
    this.agentsService.getAgent(id).subscribe((agent: any) => {
      this.showagent = agent;
      this.isLoading = false;
      console.log(this.showagent);
    });

    this.usersService.getAllusers().subscribe((user: any) => {
      this.users = user.values;
    });

  }

  // Set permissions
  manageAgentAccess: any;

  setAccessPermissions(){
    this.usersService.getUser(this.usersService.userId,{'expand':'globalPermissionGroup'}).subscribe((perm: any) => {
        this.manageAgentAccess = perm.globalPermissionGroup.permissions.manageAgentAccess;
    });
  }

  timespent: number;
  getchunks: any;

  timeCalc(chunks){
    var tspent = [];
    for(let i=0; i < chunks.length; i++){
      tspent.push(Math.max(chunks[i].solveTime, chunks[i].dispatchTime)-chunks[i].dispatchTime);
    }
    this.timespent = tspent.reduce((a, i) => a + i);
  }

  assignChunksInit(id: number){
    let params = {'maxResults': 999999};
    this.chunkService.getChunks(params).subscribe((c: any)=>{
      var getchunks = c.values.filter(u=> u.agentId == id);
      this.tasksService.getAlltasks(params).subscribe((t: any)=>{
        this.getchunks = getchunks.map(mainObject => {
          let matchObjectAgents = t.values.find(e => e.taskId === mainObject.taskId)
          return { ...mainObject, ...matchObjectAgents}
        })
      this.timeCalc(this.getchunks);
      this.dtTrigger.next(void 0);
      })
    });

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
  }

  onSubmit(){
    if(this.manageAgentAccess || typeof this.manageAgentAccess == 'undefined'){
    if (this.updateForm.valid) {

      this.isLoading = true;

      this.agentsService.updateAgent(this.editedAgentIndex,this.updateForm.value).subscribe((agent: any) => {
        const response = agent;
        console.log(response);
        this.isLoading = false;
          Swal.fire({
            title: "Good job!",
            text: "Agent updated!",
            icon: "success",
            showConfirmButton: false,
            timer: 1500
          });
          this.updateForm.reset(); // success, we reset form
          this.router.navigate(['agents/show-agents']);
        },
        errorMessage => {
          // check error status code is 500, if so, do some action
          Swal.fire({
            title: "Error!",
            text: "Agent was not created, please try again!",
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

  private initForm() {
    this.isLoading = true;
    if (this.editMode) {
      this.agentsService.getAgent(this.editedAgentIndex).subscribe((result)=>{
      this.updateForm = new FormGroup({
        'isActive': new FormControl(result['isActive'], [Validators.required]),
        'userId': new FormControl(result['userId']),
        'agentName': new FormControl(result['agentName'], [Validators.required]),
        'token': new FormControl(result['token']),
        'cpuOnly': new FormControl(result['cpuOnly']),
        'cmdPars': new FormControl(result['cmdPars']),
        'ignoreErrors': new FormControl(result['ignoreErrors']),
        'isTrusted': new FormControl(result['isTrusted'])
      });
      this.isLoading = false;
    });
   }
  }

}
