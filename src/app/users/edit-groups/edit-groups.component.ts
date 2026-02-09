import { firstValueFrom } from 'rxjs';

import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { JAgent } from '@models/agent.model';
import { FilterType } from '@models/request-params.model';

import { ConfirmDialogService } from '@services/confirm/confirm-dialog.service';
import { RequestParamBuilder } from '@services/params/builder-implementation.service';
import { AccessGroupRoleService } from '@services/roles/user/accessgroup-role.service';

import { AccessGroupsAgentsTableComponent } from '@components/tables/access-groups-agents-table/access-groups-agents-table.component';
import { AccessGroupsUserTableComponent } from '@components/tables/access-groups-users-table/access-groups-users-table.component';

import { AGENT_MAPPING, DEFAULT_FIELD_MAPPING } from '@src/app/core/_constants/select.config';
import { JAccessGroup } from '@src/app/core/_models/access-group.model';
import { ResponseWrapper } from '@src/app/core/_models/response.model';
import { JsonAPISerializer } from '@src/app/core/_services/api/serializer-service';
import { RelationshipType, SERV } from '@src/app/core/_services/main.config';
import { GlobalService } from '@src/app/core/_services/main.service';
import { AlertService } from '@src/app/core/_services/shared/alert.service';
import { AutoTitleService } from '@src/app/core/_services/shared/autotitle.service';
import { UnsubscribeService } from '@src/app/core/_services/unsubscribe.service';
import { SelectOption, transformSelectOptions } from '@src/app/shared/utils/forms';
import {
  AddAgentsForm,
  AddUserForm,
  getAddAgentsForm,
  getAddUsersForm
} from '@src/app/users/edit-groups/edit-groups.form';

@Component({
  selector: 'app-edit-groups',
  templateUrl: './edit-groups.component.html',
  standalone: false
})
export class EditGroupsComponent implements OnInit, OnDestroy {
  accessGroup: JAccessGroup; // The access group currently being edited

  addAgentsForm: FormGroup<AddAgentsForm>; // Form group for adding agents to group
  addUsersForm: FormGroup<AddUserForm>; // Form group for adding users to group

  editName: string; // Name of the access group being edited
  editedAccessGroupIndex: number; // Index of the access group being edited

  isAgentsLoading: boolean = true; // Show a spinner while loading agents for multiselect
  isLoading: boolean = true; // Flag indicating whether data is still loading
  isUpdatingLoading: boolean = false; // Show a spinner loading when form is being updated
  isUsersLoading: boolean = true; // Show a spinner while loading users for multiselect

  selectAgents: SelectOption[]; // Selectable agents to be added to the access group
  selectUsers: SelectOption[]; // Selectable users to be added to the access group

  updateForm: FormGroup; // Form group for editing access group

  @ViewChild('userTable') userTable: AccessGroupsUserTableComponent;
  @ViewChild('agentTable') agentTable: AccessGroupsAgentsTableComponent;

  private alert = inject(AlertService);
  private confirmDialog = inject(ConfirmDialogService);
  private gs = inject(GlobalService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  readonly titleService = inject(AutoTitleService);
  private unsubscribeService = inject(UnsubscribeService);
  protected roleService = inject(AccessGroupRoleService);

  constructor() {
    this.onInitialize();
    this.buildForm();
    this.titleService.set(['Edit Access Group']);
  }

  /**
   * Initializes the component by extracting and setting the user ID,
   */
  onInitialize() {
    this.route.params.subscribe((params: Params) => {
      this.editedAccessGroupIndex = +params['id'];
    });
  }

  /**
   * Lifecycle hook called after component initialization.
   */
  ngOnInit(): void {
    this.loadData();
  }

  /**
   * Lifecycle hook called before the component is destroyed.
   * Unsubscribes from all subscriptions to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.unsubscribeService.unsubscribeAll();
  }

  /**
   * Builds the form for editing an access group.
   */
  buildForm(): void {
    this.updateForm = new FormGroup({
      groupName: new FormControl()
    });
    this.addUsersForm = getAddUsersForm();
    this.addAgentsForm = getAddAgentsForm();
  }

  /**
   * Loads data, access group data and select options for the component.
   */
  loadData(): void {
    void this.initForm();
  }

  /**
   * Loads access group including its current userMembers and agentMembers by ID from server
   */
  async loadAccessGroup() {
    const requestParams = new RequestParamBuilder().addInclude('userMembers').addInclude('agentMembers').create();
    try {
      const response: ResponseWrapper = await firstValueFrom(
        this.gs.get(SERV.ACCESS_GROUPS, this.editedAccessGroupIndex, requestParams)
      );

      this.accessGroup = new JsonAPISerializer().deserialize<JAccessGroup>({
        data: response.data,
        included: response.included
      });
    } catch (error) {
      console.error('Failed to load access group data:', error);
    }
  }

  /**
   * Load all users currently not part of the accessGroup as options for select input
   */
  async loadSelectUsers() {
    try {
      this.isUsersLoading = true;
      if (this.accessGroup.userMembers) {
        const ids = this.accessGroup.userMembers.map((user) => user.id);
        const requestParamBuilder = new RequestParamBuilder();
        if (ids.length > 0) {
          requestParamBuilder.addFilter({ field: 'id', operator: FilterType.NOTIN, value: ids });
        }
        const requestParams = requestParamBuilder.create();

        const response: ResponseWrapper = await firstValueFrom(this.gs.getAll(SERV.USERS, requestParams));
        const users = new JsonAPISerializer().deserialize<JAccessGroup[]>({
          data: response.data,
          included: response.included
        });
        this.selectUsers = transformSelectOptions(users, DEFAULT_FIELD_MAPPING);
      }
    } catch (error) {
      console.error('Failed to load user data: ', error);
    } finally {
      this.isUsersLoading = false;
    }
  }

  /**
   * Load all agents currently not part of the accessGroup as options for select input
   */
  async loadSelectAgents() {
    try {
      this.isAgentsLoading = true;
      if (this.accessGroup.agentMembers) {
        const ids = this.accessGroup.agentMembers.map((agent) => agent.id);

        // Only include filter, if there are agentMembers
        const requestParamBuilder = new RequestParamBuilder();
        if (ids.length > 0) {
          requestParamBuilder.addFilter({ field: 'id', operator: FilterType.NOTIN, value: ids });
        }
        const requestParams = requestParamBuilder.create();
        const response: ResponseWrapper = await firstValueFrom(this.gs.getAll(SERV.AGENTS, requestParams));
        const agents = new JsonAPISerializer().deserialize<JAgent[]>({
          data: response.data,
          included: response.included
        });
        this.selectAgents = transformSelectOptions(agents, AGENT_MAPPING);
      }
    } catch (error) {
      console.error('Failed to load user data: ', error);
    } finally {
      this.isAgentsLoading = false;
    }
  }

  /**
   * Initializes the form with user data retrieved from the server.
   */
  async initForm() {
    await this.loadAccessGroup();
    this.editName = this.accessGroup.groupName;
    this.updateForm = new FormGroup({
      groupName: new FormControl(this.accessGroup.groupName)
    });
    void this.loadSelectUsers();
    void this.loadSelectAgents();
  }

  /**
   * Reload data
   */
  refresh() {
    this.isLoading = true;
    this.onInitialize();
    this.loadData();
  }

  /**
   * Handles the form submission for updating access group data.
   * If the form is valid, it triggers the update process and navigates to the user list.
   */
  onSubmit() {
    if (this.updateForm.valid) {
      this.isUpdatingLoading = true;
      const onSubmitSubscription$ = this.gs
        .update(SERV.ACCESS_GROUPS, this.editedAccessGroupIndex, this.updateForm.value)
        .subscribe(() => {
          this.isUpdatingLoading = false;
          this.router
            .navigate(['/users/access-groups'])
            .then(() => this.alert.showSuccessMessage('Access Group saved'));
        });
      this.unsubscribeService.add(onSubmitSubscription$);
    } else {
      this.updateForm.markAllAsTouched();
      this.updateForm.updateValueAndValidity();
    }
  }

  /**
   * Handles the form submission for adding new users to the access group.
   */
  async onAddUsers() {
    if (this.addUsersForm.valid) {
      this.isUpdatingLoading = true;
      const users = this.addUsersForm.get('userIds').value.map((id) => ({ type: RelationshipType.USERMEMBERS, id }));
      try {
        await firstValueFrom(
          this.gs.postRelationships(SERV.ACCESS_GROUPS, this.editedAccessGroupIndex, RelationshipType.USERMEMBERS, {
            data: users
          })
        );
        this.alert.showSuccessMessage(`Successfully added ${users.length} user${users.length > 1 ? 's' : ''}`);

        // Reset the form control after successful add
        this.addUsersForm.get('userIds')?.reset();

        this.refresh(); // Reload the select component
        this.userTable.reload();
      } catch (error) {
        const msg = `Failed to add user${users.length > 1 ? 's' : ''} to access group`;
        console.error(msg, error);
        this.alert.showErrorMessage(msg);
      } finally {
        this.isUpdatingLoading = false;
      }
    }
  }

  /**
   * Handles the form submission for adding new agents to the access group.
   */
  async onAddAgents() {
    this.isUpdatingLoading = true;
    if (this.addAgentsForm.valid) {
      const agents = this.addAgentsForm.get('agentIds').value.map((id) => ({ type: RelationshipType.AGENTMEMBER, id }));
      try {
        await firstValueFrom(
          this.gs.postRelationships(SERV.ACCESS_GROUPS, this.editedAccessGroupIndex, RelationshipType.AGENTMEMBER, {
            data: agents
          })
        );
        this.alert.showSuccessMessage(`Successfully added ${agents.length} user${agents.length > 1 ? 's' : ''}`);

        // Reset the form control after successful add
        this.addAgentsForm.get('agentIds')?.reset();

        this.refresh(); // Reload the select component
        this.agentTable.reload();
      } catch (error) {
        const msg = `Failed to add user${agents.length > 1 ? 's' : ''} to access group`;
        console.error(msg, error);
        this.alert.showErrorMessage(msg);
      } finally {
        this.isUpdatingLoading = false;
      }
    }
  }

  /**
   * Handles the deletion of an access group.
   * Displays a confirmation dialog and, if confirmed, triggers the deletion process.
   * If the deletion is successful, it navigates to the user list.
   */
  onDelete() {
    this.confirmDialog.confirmDeletion('Access Group', this.editName).subscribe((confirmed) => {
      if (confirmed) {
        this.unsubscribeService.add(
          this.gs.delete(SERV.ACCESS_GROUPS, this.editedAccessGroupIndex).subscribe(() => {
            // Successful deletion
            this.router
              .navigate(['/users/access-groups'])
              .then(() => this.alert.showSuccessMessage(`Succesfully deleted access group: ${this.editName}`));
          })
        );
      }
    });
  }

  /**
   * Reload component if agents have been removed from access group
   */
  onAgentsRemoved(): void {
    this.refresh();
  }

  /**
   * Reload component if users have been removed from access group
   */
  onUsersRemoved(): void {
    this.refresh();
  }
}
