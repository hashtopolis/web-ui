import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { AlertService } from 'src/app/core/_services/shared/alert.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../../core/_services/main.config';

@Component({
  selector: 'app-cu-group',
  templateUrl: './cu-group.component.html'
})
@PageTitle(['Group'])
export class CUGroupComponent implements OnInit {

  // Create or Edit Binary
  whichView: string;
  editMode = false;
  editedIndex: number;

  constructor(
    private route:ActivatedRoute,
    private alert: AlertService,
    private gs: GlobalService,
    private router:Router
  ) { }

  Form = new FormGroup({
    'groupName': new FormControl('', [Validators.required, Validators.minLength(1)]),
  });

  ngOnInit(): void {

    this.route.params
    .subscribe(
      (params: Params) => {
        this.editedIndex = +params['id'];
        this.editMode = params['id'] != null;
      }
    );

    this.route.data.subscribe(data => {
      switch (data['kind']) {

        case 'new-access-groups':
          this.whichView = 'create';
        break;

        case 'edit-access-groups':
          this.whichView = 'edit';
          this.initForm();
        break;

      }
    });

  }

  private initForm() {
    if (this.editMode) {
    this.gs.get(SERV.ACCESS_GROUPS,this.editedIndex).subscribe((result)=>{
      this.Form = new FormGroup({
        'groupName': new FormControl(result['groupName']),
      });
    });
  }
  }

  onSubmit(): void{
    if (this.Form.valid) {

    switch (this.whichView) {

      case 'create':
        this.gs.create(SERV.ACCESS_GROUPS,this.Form.value).subscribe(() => {
          this.alert.okAlert('New Access Group created!','');
          this.router.navigate(['/users/access-groups']);
        }
      );
      break;

      case 'edit':
        this.gs.update(SERV.ACCESS_GROUPS,this.editedIndex,this.Form.value).subscribe(() => {
          this.alert.okAlert('Access Group saved!','');
          this.router.navigate(['/users/access-groups']);
        });
      break;
    }
  }
}

}
