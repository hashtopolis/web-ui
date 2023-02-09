import { faHomeAlt, faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { AgentBinService } from '../../../../core/_services/config/agentbinary.service';


@Component({
  selector: 'app-agent-binaries',
  templateUrl: './new-agent-binaries.component.html'
})
export class NewAgentBinariesComponent implements OnInit {

  editMode = false;
  editedABIndex: number;

  // Loader
  isLoading = false;

  public isCollapsed = true;
  faHome=faHomeAlt;
  faPlus=faPlus;
  faTrash=faTrash;
  faEdit=faEdit;

  public binaries: {agentBinaryId: number, type: string, version: string, operatingSystems: string, filename: string, updateTrack: string, updateAvailable: string}[] = [];

  constructor(
    private agentBinService: AgentBinService,
    private route:ActivatedRoute, private router:Router
  ) { }

  // Create or Edit Binary
  whichView: string;

  updateForm = new FormGroup({
    'type': new FormControl(''),
    'operatingSystems': new FormControl(''),
    'version': new FormControl(''),
    'updateTrack': new FormControl(''),
  });

  ngOnInit(): void {

    this.route.params
    .subscribe(
      (params: Params) => {
        this.editedABIndex = +params['id'];
        this.editMode = params['id'] != null;
      }
    );

    this.route.data.subscribe(data => {
      switch (data['kind']) {

        case 'new-agent-binary':
          this.whichView = 'create';
        break;

        case 'edit-agent-binary':
          this.whichView = 'edit';
          this.isLoading = true;
          this.initForm();

          const id = +this.route.snapshot.params['id'];
          this.agentBinService.getAgentBin(id).subscribe((bin: any) => {
            this.binaries = bin.values;
            this.isLoading = false;
          });
        break;

      }
    });
  }

  onSubmit(): void{
    if (this.updateForm.valid) {

      this.isLoading = true;

      switch (this.whichView) {

        case 'create':
          this.agentBinService.createAgentBin(this.updateForm.value)
          .subscribe((prep: any) => {
            const response = prep;
            console.log(response);
            this.isLoading = false;
              Swal.fire({
                title: "Good job!",
                text: "New Agent Binary created!",
                icon: "success",
                showConfirmButton: false,
                timer: 1500
              });
              this.router.navigate(['config/engine/agent-binaries']);
            },
            errorMessage => {
              // check error status code is 500, if so, do some action
              Swal.fire({
                title: "Error!",
                text: "New Binary was not created, please try again!",
                icon: "warning",
                showConfirmButton: true
              });
            }
          );
        break;

        case 'edit':
          const id = +this.route.snapshot.params['id'];
          this.agentBinService.updateAgentBin(id,this.updateForm.value)
          .subscribe((prep: any) => {
            const response = prep;
            console.log(response);
            this.isLoading = false;
              Swal.fire({
                title: "Good job!",
                text: "Agent Binary updated!",
                icon: "success",
                showConfirmButton: false,
                timer: 1500
              });
              this.router.navigate(['config/engine/agent-binaries']);
            },
            errorMessage => {
              // check error status code is 500, if so, do some action
              Swal.fire({
                title: "Error!",
                text: "New Binary was not created, please try again!",
                icon: "warning",
                showConfirmButton: true
              });
            }
          );
        break;

      }
    }

  }

  private initForm() {
    this.isLoading = true;
    if (this.editMode) {
    this.agentBinService.getAgentBin(this.editedABIndex).subscribe((result)=>{
      this.updateForm = new FormGroup({
        'type': new FormControl(result['type']),
        'operatingSystems': new FormControl(result['operatingSystems']),
        'version': new FormControl(result['version']),
        'updateTrack': new FormControl(result['updateTrack']),
      });
      this.isLoading = false;
    });
   }
  }



}
