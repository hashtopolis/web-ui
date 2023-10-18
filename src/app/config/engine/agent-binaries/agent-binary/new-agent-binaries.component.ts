import { faHomeAlt, faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { GlobalService } from 'src/app/core/_services/main.service';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../../../core/_services/main.config';
import { AlertService } from 'src/app/core/_services/shared/alert.service';

@Component({
  selector: 'app-agent-binaries',
  templateUrl: './new-agent-binaries.component.html'
})
@PageTitle(['Agent Binary'])
export class NewAgentBinariesComponent implements OnInit {

  editMode = false;
  editedABIndex: number;

  public isCollapsed = true;
  faHome=faHomeAlt;
  faPlus=faPlus;
  faTrash=faTrash;
  faEdit=faEdit;

  public binaries: {agentBinaryId: number, type: string, version: string, operatingSystems: string, filename: string, updateTrack: string, updateAvailable: string}[] = [];

  constructor(
    private route:ActivatedRoute,
    private alert: AlertService,
    private gs: GlobalService,
    private router:Router
  ) { }

  // Create or Edit Binary
  whichView: string;

  updateForm = new FormGroup({
    'type': new FormControl(''),
    'filename': new FormControl(''),
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
          this.initForm();

          const id = +this.route.snapshot.params['id'];
          this.gs.get(SERV.AGENT_BINARY,id).subscribe((bin: any) => {
            this.binaries = bin.values;
          });
        break;

      }
    });
  }

  onSubmit(): void{
    if (this.updateForm.valid) {

      switch (this.whichView) {

        case 'create':
          this.gs.create(SERV.AGENT_BINARY,this.updateForm.value)
          .subscribe((prep: any) => {
            const response = prep;
            this.alert.okAlert('New Agent Binary created!','');
            this.router.navigate(['config/engine/agent-binaries']);
            }
          );
        break;

        case 'edit':
          const id = +this.route.snapshot.params['id'];
          this.gs.update(SERV.AGENT_BINARY,id,this.updateForm.value)
          .subscribe((prep: any) => {
            const response = prep;
            this.alert.okAlert('Agent Binary saved!','');
            this.router.navigate(['config/engine/agent-binaries']);
            }
          );
        break;

      }
    }

  }

  private initForm() {
    if (this.editMode) {
    this.gs.get(SERV.AGENT_BINARY,this.editedABIndex).subscribe((result)=>{
      this.updateForm = new FormGroup({
        'type': new FormControl(result['type']),
        'filename': new FormControl(result['filename']),
        'operatingSystems': new FormControl(result['operatingSystems']),
        'version': new FormControl(result['version']),
        'updateTrack': new FormControl(result['updateTrack']),
      });
    });
   }
  }



}
