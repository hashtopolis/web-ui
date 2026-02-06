/**
 * This module contains the component to create a new user
 */
import { firstValueFrom } from 'rxjs';

import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { JGlobalPermissionGroup } from '@models/global-permission-group.model';
import { ResponseWrapper } from '@models/response.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AlertService } from '@services/shared/alert.service';

import { DEFAULT_FIELD_MAPPING } from '@src/app/core/_constants/select.config';
import { SelectOption, transformSelectOptions } from '@src/app/shared/utils/forms';
import { NewUserForm, getNewUserForm } from '@src/app/users/new-user/new-user.form';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  standalone: false
})
export class NewUserComponent implements OnInit {
  newUserForm: FormGroup<NewUserForm>;
  selectGlobalPermissionGroups: SelectOption[];
  loading = false;
  loadingPermissionGroups: boolean = false;

  constructor(
    private gs: GlobalService,
    private router: Router,
    private alert: AlertService
  ) {
    this.newUserForm = getNewUserForm();
  }

  ngOnInit(): void {
    void this.loadPermissionGroups();
  }

  /**
   * Loads global permissions groups for select box from the server
   */
  async loadPermissionGroups() {
    this.loadingPermissionGroups = true;
    try {
      const response = await firstValueFrom<ResponseWrapper>(this.gs.getAll(SERV.ACCESS_PERMISSIONS_GROUPS));

      const permissionGroups = new JsonAPISerializer().deserialize<JGlobalPermissionGroup[]>({
        data: response.data,
        included: response.included
      });
      this.selectGlobalPermissionGroups = transformSelectOptions(permissionGroups, DEFAULT_FIELD_MAPPING);
    } catch (err) {
      console.error('Failed to fetch permission groups:', err);
      this.alert.showErrorMessage('Error fetching permission groups');
    } finally {
      this.loadingPermissionGroups = false;
    }
  }

  /**
   * Create new user upon form submission and redirect to user table page on success
   */
  async onSubmit() {
    if (this.newUserForm.invalid) {
      this.newUserForm.markAllAsTouched();
      this.newUserForm.updateValueAndValidity();
      return;
    }
    this.loading = true;

    try {
      const payload = {
        name: this.newUserForm.value.username,
        email: this.newUserForm.value.email,
        globalPermissionGroupId: this.newUserForm.value.globalPermissionGroupId,
        isValid: this.newUserForm.value.isValid
      };

      await firstValueFrom(this.gs.create(SERV.USERS, payload));
      this.alert.showSuccessMessage('User created');
      void this.router.navigate(['users/all-users']);
    } catch (err) {
      const msg = 'Error creating user';
      console.error(msg, err);
      this.alert.showErrorMessage(msg);
    } finally {
      this.loading = false;
    }
  }
}
