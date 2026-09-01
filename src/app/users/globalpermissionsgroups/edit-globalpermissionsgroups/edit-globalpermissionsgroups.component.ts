/**
 * This module contains the component to manage and edit GlobalPermissionGroups
 */
import { zGlobalPermissionGroupResponse } from '@generated/api/zod';

import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';

import { JGlobalPermissionGroup } from '@models/global-permission-group.model';
import { ResponseWrapper } from '@models/response.model';
import { zIdRouteParams } from '@models/routes.schema';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

@Component({
  selector: 'app-edit-globalpermissionsgroups',
  templateUrl: './edit-globalpermissionsgroups.component.html',
  standalone: false
})
export class EditGlobalpermissionsgroupsComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private titleService = inject(AutoTitleService);
  private route = inject(ActivatedRoute);
  private alert = inject(AlertService);
  private gs = inject(GlobalService);

  updateForm: FormGroup<{ name: FormControl<string | null> }>;
  processing = false;

  // Filters and forms
  editedGPGIndex: number;
  editedGPG: JGlobalPermissionGroup | undefined;

  constructor() {
    this.onInitialize();
    this.buildForm();
    this.titleService.set(['Edit Global Permissions']);
  }

  /**
   * Initializes the component by extracting and setting the user ID,
   */
  onInitialize() {
    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params: Params) => {
      this.editedGPGIndex = zIdRouteParams.parse(params).id;
    });
  }

  /**
   * Lifecycle hook called after component initialization.
   */
  ngOnInit() {
    this.initForm();
  }

  /**
   * Build the form with default values for permissions.
   */
  buildForm() {
    this.updateForm = new FormGroup<{ name: FormControl<string | null> }>({
      name: new FormControl('', [Validators.required])
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
    this.gs
      .get(SERV.ACCESS_PERMISSIONS_GROUPS, this.editedGPGIndex, {
        include: ['userMembers']
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response: ResponseWrapper) => {
        if (response) {
          this.editedGPG = new JsonAPISerializer().deserialize(response, zGlobalPermissionGroupResponse);
          const formValues = this.buildFormValues();
          this.updateForm.patchValue(formValues);
        }
      });
  }

  /**
   * Builds form values based on the result received from the server.
   * It sets the default values for the 'name' and 'permissions' fields.
   * @private
   * @returns Form values object with 'name' and 'permissions' fields.
   */
  private buildFormValues() {
    return {
      name: this.editedGPG!['name'],
      permissions: {}
    };
  }

  /**
   * OnSubmit save changes
   */
  onSubmit() {
    if (this.updateForm.valid) {
      this.processing = true;
      this.gs
        .update(SERV.ACCESS_PERMISSIONS_GROUPS, this.editedGPGIndex, this.updateForm.value)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.alert.showSuccessMessage('Global Permission Group saved');
          this.processing = false;
        });
    } else {
      this.updateForm.markAllAsTouched();
      this.updateForm.updateValueAndValidity();
    }
  }
}
