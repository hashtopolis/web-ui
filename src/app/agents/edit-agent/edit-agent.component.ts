import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faAlignJustify, faIdBadge, faComputer, faKey, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { faLinux, faWindows, faApple } from '@fortawesome/free-brands-svg-icons';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { AgentsService } from '../../core/_services/agents/agents.service';
import { UsersService } from '../../core/_services/users/users.service';
import { Observable } from 'rxjs';

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
  faIdBadge=faIdBadge;
  faComputer=faComputer;
  faKey=faKey;
  faLinux=faLinux;
  faWindows=faWindows;
  faApple=faApple;
  faInfoCircle=faInfoCircle;

  constructor(
    private route:ActivatedRoute,
    private router: Router,
    private agentsService: AgentsService,
    private usersService: UsersService
  ) { }

  updateForm: FormGroup
  showagent: any = [];
  users: any = [];

  ngOnInit(): void {

    this.route.params
    .subscribe(
      (params: Params) => {
        this.editedAgentIndex = +params['id'];
        this.editMode = params['id'] != null;
        this.initForm();
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

  onSubmit(){
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
