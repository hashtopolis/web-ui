import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject, Subscription } from 'rxjs';

import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { AlertService } from 'src/app/core/_services/shared/alert.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { SERV } from '../../../core/_services/main.config';
import { UnsubscribeService } from 'src/app/core/_services/unsubscribe.service';
import { Perm } from 'src/app/core/_constants/userpermissions.config';

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

  // Filters and forms
  editedGPGIndex: number;
  editedGPG: any;

  // Permisions
  private permissionValues: string[] = [];

  // Form Permissions
  permissionGroups: any[] = [
    {
      title: 'Agents',
      subgroups: [
        { subtitle: 'Agents', permissions: Object.values(Perm.Agent) },
        { subtitle: 'Agent Stats', permissions: Object.values(Perm.AgentStat) },
        { subtitle: 'Voucher', permissions: Object.values(Perm.Voucher) }
      ]
    },
    {
      title: 'Tasks',
      subgroups: [
        { subtitle: 'Task', permissions: Object.values(Perm.Task) },
        { subtitle: 'PreTask', permissions: Object.values(Perm.Pretask) },
        { subtitle: 'SuperTask', permissions: Object.values(Perm.SuperTask) },
        { subtitle: 'Chunks', permissions: Object.values(Perm.Chunk) }
      ]
    },
    {
      title: 'Hashlists',
      subgroups: [
        { subtitle: 'Hashlist', permissions: Object.values(Perm.Hashlist) },
        {
          subtitle: 'SuperHaslist',
          permissions: Object.values(Perm.SuperHashlist)
        },
        { subtitle: 'Hash', permissions: Object.values(Perm.Hash) }
      ]
    },
    {
      title: 'Files',
      subgroups: [
        {
          subtitle: 'Files',
          permissions: Object.values(Perm.File)
        }
      ]
    },
    {
      title: 'Configuration',
      subgroups: [
        {
          subtitle: 'Global Settings',
          permissions: Object.values(Perm.Config)
        },
        {
          subtitle: 'Agent Binary',
          permissions: Object.values(Perm.AgentBinary)
        },
        {
          subtitle: 'Cracker Binary',
          permissions: Object.values(Perm.CrackerBinary)
        },
        {
          subtitle: 'Cracker Binary Type',
          permissions: Object.values(Perm.CrackerBinaryType)
        },
        { subtitle: 'Preprocessor', permissions: Object.values(Perm.Prepro) },
        {
          subtitle: 'Health Check',
          permissions: Object.values(Perm.HealthCheck)
        }
      ]
    },
    {
      title: 'Users',
      subgroups: [
        { subtitle: 'User', permissions: Object.values(Perm.User) },
        {
          subtitle: 'Notifications',
          permissions: Object.values(Perm.Notif)
        }
      ]
    },
    {
      title: 'Permissions',
      subgroups: [
        {
          subtitle: 'Global Permissions',
          permissions: Object.values(Perm.RightGroup)
        },
        {
          subtitle: 'Access Groups',
          permissions: Object.values(Perm.GroupAccess)
        }
      ]
    }
  ];

  // Table to be replaced
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

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
    this.permissionValues = Object.values(Perm).flatMap((permission) => {
      return typeof permission === 'string'
        ? [permission]
        : Object.values(permission);
    });

    const permissionsGroup = this.permissionValues.reduce((group, perm) => {
      group[perm] = new FormControl(false);
      return group;
    }, {});

    this.updateForm = new FormGroup({
      name: new FormControl(),
      permissions: new FormGroup(permissionsGroup)
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
          const result = res['permissions'];

          const formValues = this.buildFormValues(result);

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
  private buildFormValues(result: any): any {
    const formValues: any = {
      name: this.editedGPG['name'],
      permissions: {}
    };

    for (const permission of this.permissionValues) {
      formValues.permissions[permission] = result
        ? result[permission] || false
        : false;
    }

    return formValues;
  }

  /**
   * OnSubmit save changes
   */
  onSubmit() {
    if (this.updateForm.valid) {
      const onSubmitSubscription$ = this.gs
        .update(
          SERV.ACCESS_PERMISSIONS_GROUPS,
          this.editedGPGIndex,
          this.updateForm.value
        )
        .subscribe(() => {
          this.alert.okAlert('Global Permission Group saved!', '');
          this.updateForm.reset();
          this.router.navigate(['/users/global-permissions-groups']);
        });
      this.unsubscribeService.add(onSubmitSubscription$);
    }
  }

  /**
   * Get a human-readable title from a permission string.
   *
   * @param {string} permission - The permission string to extract the title from.
   * @returns {string} The corresponding title based on keywords like 'Create', 'Read', 'Update', 'Delete'.
   */
  getTitleFromPermission(permission: string): string {
    if (permission.includes('Create')) {
      return 'Create';
    } else if (permission.includes('Read')) {
      return 'Read';
    } else if (permission.includes('Update')) {
      return 'Update';
    } else if (permission.includes('Delete')) {
      return 'Delete';
    } else {
      // Default title if none of the keywords match
      return 'Other';
    }
  }

  /**
   * Toggles the state of all permissions checkboxes in the form.
   *
   * @param {boolean} checked - The state to set for all checkboxes (true for checked, false for unchecked).
   * @returns {void}
   */
  toggleAllPermissions(checked: boolean) {
    const permissionsFormGroup = this.updateForm.get(
      'permissions'
    ) as FormGroup;

    Object.keys(permissionsFormGroup.controls).forEach((controlName) => {
      const control = permissionsFormGroup.get(controlName);
      if (control) {
        control.setValue(checked);
      }
    });
  }

  /**
   * Prevents the default behavior of an event.
   *
   * @param {Event} event - The event for which to prevent the default behavior.
   * @returns {void}
   */
  preventDefault(event: Event) {
    event.preventDefault();
  }
}
