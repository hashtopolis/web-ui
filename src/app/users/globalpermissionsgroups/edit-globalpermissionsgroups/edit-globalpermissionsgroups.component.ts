import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ResponseWrapper } from '@src/app/core/_models/response.model';

import { AlertService } from '@src/app/core/_services/shared/alert.service';
import { AutoTitleService } from '@src/app/core/_services/shared/autotitle.service';
import { GlobalService } from '@src/app/core/_services/main.service';
import { JsonAPISerializer } from '@src/app/core/_services/api/serializer-service';
import { SERV } from '@src/app/core/_services/main.config';
import { UnsubscribeService } from '@src/app/core/_services/unsubscribe.service';

/**
 * EditGlobalpermissionsgroupsComponent is a component that manages and edit Global Permissions data.
 *
 */
@Component({
    selector: 'app-edit-globalpermissionsgroups',
    templateUrl: './edit-globalpermissionsgroups.component.html',
    standalone: false
})
export class EditGlobalpermissionsgroupsComponent implements OnInit, OnDestroy {
  /** Form group for edit User. */
  updateForm: FormGroup;

  /** Form processing spinner. */
  processing = false;

  // Filters and forms
  editedGPGIndex: number;
  editedGPG: any = {};

  constructor(
    private unsubscribeService: UnsubscribeService,
    private titleService: AutoTitleService,
    private route: ActivatedRoute,
    private alert: AlertService,
    private gs: GlobalService,
    private router: Router
  ) {
    this.onInitialize();
    this.buildForm();
    titleService.set(['Edit Global Permissions']);
  }

  /**
   * Initializes the component by extracting and setting the user ID,
   */
  onInitialize() {
    this.route.params.subscribe((params: Params) => {
      this.editedGPGIndex = +params['id'];
    });
  }

  /**
   * Lifecycle hook called after component initialization.
   */
  ngOnInit() {
    this.initForm();
  }

  /**
   * Lifecycle hook called before the component is destroyed.
   * Unsubscribes from all subscriptions to prevent memory leaks.
   */
  ngOnDestroy() {
    this.unsubscribeService.unsubscribeAll();
  }

  /**
   * Build the form with default values for permissions.
   */
  buildForm() {
    this.updateForm = new FormGroup({
      name: new FormControl('')
    });
  }

  /**
   * Initialize the form with data obtained from the server.
   */
  initForm() {
    this.loadData();
  }

  /**
   * Loads data from the server for the edited global permission group.
   * Populates the form with the received data.
   * @private
   */
  private loadData() {
    const loadSubscription$ = this.gs
      .get(SERV.ACCESS_PERMISSIONS_GROUPS, this.editedGPGIndex, {
        include: ['userMembers']
      })
      .subscribe((response: ResponseWrapper) => {
        if (response) {
          this.editedGPG = new JsonAPISerializer().deserialize({
            data: response.data,
            included: response.included
          });
          const formValues = this.buildFormValues();
          this.updateForm.patchValue(formValues);
        }
      });

    this.unsubscribeService.add(loadSubscription$);
  }

  /**
   * Builds form values based on the result received from the server.
   * It sets the default values for the 'name' and 'permissions' fields.
   * @private
   * @returns Form values object with 'name' and 'permissions' fields.
   */
  private buildFormValues(): any {
    return {
      name: this.editedGPG['name'],
      permissions: {}
    };
  }

  /**
   * OnSubmit save changes
   */
  onSubmit() {
    if (this.updateForm.valid) {
      this.processing = true;
      const onSubmitSubscription$ = this.gs
        .update(SERV.ACCESS_PERMISSIONS_GROUPS, this.editedGPGIndex, this.updateForm.value)
        .subscribe(() => {
          this.alert.okAlert('Global Permission Group saved!', '');
          this.processing = false;
        });
      this.unsubscribeService.add(onSubmitSubscription$);
    }
  }
}
