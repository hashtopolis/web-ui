import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { AlertService } from 'src/app/core/_services/shared/alert.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { SERV } from '../../../core/_services/main.config';
import { UnsubscribeService } from 'src/app/core/_services/unsubscribe.service';

/**
 * EditGlobalpermissionsgroupsComponent is a component that manages and edit Global Permissions data.
 *
 */
@Component({
  selector: 'app-edit-globalpermissionsgroups',
  templateUrl: './edit-globalpermissionsgroups.component.html'
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
  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Lifecycle hook called before the component is destroyed.
   * Unsubscribes from all subscriptions to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.unsubscribeService.unsubscribeAll();
  }

  /**
   * Build the form with default values for permissions.
   *
   * @returns {void}
   */
  buildForm(): void {
    this.updateForm = new FormGroup({
      name: new FormControl()
    });
  }

  /**
   * Initialize the form with data obtained from the server.
   *
   * @returns {void}
   */
  initForm() {
    this.loadData();
  }

  /**
   * Loads data from the server for the edited global permission group.
   * Populates the form with the received data.
   *
   * @private
   * @returns {void}
   */
  private loadData() {
    const loadSubscription$ = this.gs
      .get(SERV.ACCESS_PERMISSIONS_GROUPS, this.editedGPGIndex, {
        expand: 'user'
      })
      .subscribe((res) => {
        if (res) {
          this.editedGPG = res;
          console.log(res);
          const formValues = this.buildFormValues();
          this.updateForm.patchValue(formValues);
        }
      });

    this.unsubscribeService.add(loadSubscription$);
  }

  /**
   * Builds form values based on the result received from the server.
   * It sets the default values for the 'name' and 'permissions' fields.
   *
   * @private
   * @param {any} result - The result data received from the server, typically representing permissions.
   * @returns {any} Form values object with 'name' and 'permissions' fields.
   */
  private buildFormValues(): any {
    const formValues: any = {
      name: this.editedGPG['name'],
      permissions: {}
    };
    return formValues;
  }

  /**
   * OnSubmit save changes
   */
  onSubmit() {
    if (this.updateForm.valid) {
      this.processing = true;
      const onSubmitSubscription$ = this.gs
        .update(
          SERV.ACCESS_PERMISSIONS_GROUPS,
          this.editedGPGIndex,
          this.updateForm.value
        )
        .subscribe(() => {
          this.alert.okAlert('Global Permission Group saved!', '');
          this.processing = false;
        });
      this.unsubscribeService.add(onSubmitSubscription$);
    }
  }
}
