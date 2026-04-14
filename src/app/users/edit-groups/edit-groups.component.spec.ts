import { zAccessGroupListResponse, zUserListResponse } from '@generated/api/zod';
import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ResponseWrapper } from '@models/response.model';

import { ConfirmDialogService } from '@services/confirm/confirm-dialog.service';
import { RelationshipType, SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AccessGroupRoleService } from '@services/roles/user/accessgroup-role.service';
import { AlertService } from '@services/shared/alert.service';
import { AutoTitleService } from '@services/shared/autotitle.service';
import { UnsubscribeService } from '@services/unsubscribe.service';

import { AccessGroupsAgentsTableComponent } from '@components/tables/access-groups-agents-table/access-groups-agents-table.component';
import { AccessGroupsUserTableComponent } from '@components/tables/access-groups-users-table/access-groups-users-table.component';

import { JsonAPISerializer } from '@src/app/core/_services/api/serializer-service';
import { EditGroupsComponent } from '@src/app/users/edit-groups/edit-groups.component';

const mockAccessGroupResponse: ResponseWrapper = {
  jsonapi: { version: '1.1', ext: [] },
  data: {
    id: 1,
    type: 'accessGroup',
    attributes: {
      groupName: 'Test Group'
    }
  } as never,
  included: []
};

/**
 * Focused tests for the deserialization bug in EditGroupsComponent.loadSelectUsers().
 *
 * The bug: `loadSelectUsers()` fetches from SERV.USERS but validates
 * the response against `zAccessGroupListResponse` instead of `zUserListResponse`.
 *
 * We test the serializer directly to isolate the exact schema mismatch.
 */
describe('EditGroupsComponent deserialization', () => {
  let serializer: JsonAPISerializer;

  const jsonapi = { version: '1.1' };

  const userListBody = {
    jsonapi,
    data: [
      {
        id: 10,
        type: 'user',
        attributes: {
          name: 'alice',
          email: 'alice@example.com',
          isValid: true,
          isComputedPassword: false,
          lastLoginDate: 1752647000,
          registeredSince: 1744086300,
          sessionLifetime: 3600,
          globalPermissionGroupId: 2,
          yubikey: '0',
          otp1: '',
          otp2: '',
          otp3: '',
          otp4: ''
        }
      },
      {
        id: 20,
        type: 'user',
        attributes: {
          name: 'bob',
          email: 'bob@example.com',
          isValid: true,
          isComputedPassword: false,
          lastLoginDate: 1752647100,
          registeredSince: 1744086400,
          sessionLifetime: 7200,
          globalPermissionGroupId: 1,
          yubikey: '0',
          otp1: '',
          otp2: '',
          otp3: '',
          otp4: ''
        }
      }
    ]
  };

  beforeEach(() => {
    serializer = new JsonAPISerializer();
  });

  it('should throw when user data is deserialized with zAccessGroupListResponse (the bug)', () => {
    // This is the current (buggy) code path:
    //   const users: JAccessGroup[] = serializer.deserialize(response, zAccessGroupListResponse);
    // It should throw because user-shaped data does not match access group schema.
    expect(() => {
      serializer.deserialize(userListBody, zAccessGroupListResponse);
    }).toThrow();
  });

  it('should correctly deserialize user data with zUserListResponse (the fix)', () => {
    // After the fix, the code should use zUserListResponse
    const users = serializer.deserialize(userListBody, zUserListResponse);

    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBe(2);
    expect(users[0].name).toBe('alice');
    expect(users[1].name).toBe('bob');
  });
});

describe('EditGroupsComponent', () => {
  let component: EditGroupsComponent;
  let fixture: ComponentFixture<EditGroupsComponent>;
  let mockGlobalService: jasmine.SpyObj<GlobalService>;
  let mockAlertService: jasmine.SpyObj<AlertService>;
  let mockUserTable: jasmine.SpyObj<AccessGroupsUserTableComponent>;
  let mockAgentTable: jasmine.SpyObj<AccessGroupsAgentsTableComponent>;

  beforeEach(async () => {
    mockGlobalService = jasmine.createSpyObj('GlobalService', [
      'get',
      'getAll',
      'update',
      'delete',
      'postRelationships'
    ]);
    mockAlertService = jasmine.createSpyObj('AlertService', ['showSuccessMessage', 'showErrorMessage']);

    mockGlobalService.get.and.returnValue(of(mockAccessGroupResponse));
    mockGlobalService.getAll.and.returnValue(of({ jsonapi: { version: '1.1', ext: [] }, data: [], included: [] }));

    await TestBed.configureTestingModule({
      declarations: [EditGroupsComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: GlobalService, useValue: mockGlobalService },
        { provide: AlertService, useValue: mockAlertService },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
        { provide: ActivatedRoute, useValue: { params: of({ id: '1' }) } },
        { provide: ConfirmDialogService, useValue: jasmine.createSpyObj('ConfirmDialogService', ['confirmDeletion']) },
        { provide: AccessGroupRoleService, useValue: {} },
        { provide: AutoTitleService, useValue: jasmine.createSpyObj('AutoTitleService', ['set']) },
        UnsubscribeService
      ]
    })
      .overrideComponent(EditGroupsComponent, { set: { template: '' } })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    mockUserTable = jasmine.createSpyObj('AccessGroupsUserTableComponent', ['reload']);
    mockAgentTable = jasmine.createSpyObj('AccessGroupsAgentsTableComponent', ['reload']);
    component.userTable = mockUserTable;
    component.agentTable = mockAgentTable;
  });

  describe('adding members', () => {
    it('should reload the user table after successfully adding users', async () => {
      mockGlobalService.postRelationships.and.returnValue(of({}));
      component.addUsersForm.patchValue({ userIds: [1, 2] });

      await component.onAddUsers();

      expect(mockUserTable.reload).toHaveBeenCalled();
    });

    it('should reload the agent table after successfully adding agents', async () => {
      mockGlobalService.postRelationships.and.returnValue(of({}));
      component.addAgentsForm.patchValue({ agentIds: [3] });

      await component.onAddAgents();

      expect(mockAgentTable.reload).toHaveBeenCalled();
    });
  });

  describe('removing members', () => {
    it('should refresh when users are removed from the table', () => {
      spyOn(component, 'refresh');

      component.onUsersRemoved();

      expect(component.refresh).toHaveBeenCalled();
    });

    it('should refresh when agents are removed from the table', () => {
      spyOn(component, 'refresh');

      component.onAgentsRemoved();

      expect(component.refresh).toHaveBeenCalled();
    });
  });

  describe('postRelationships payload', () => {
    it('should post the selected user IDs to the correct relationship endpoint', async () => {
      mockGlobalService.postRelationships.and.returnValue(of({}));
      component.addUsersForm.patchValue({ userIds: [10, 20] });

      await component.onAddUsers();

      expect(mockGlobalService.postRelationships).toHaveBeenCalledWith(
        SERV.ACCESS_GROUPS,
        component.editedAccessGroupIndex,
        RelationshipType.USERMEMBERS,
        {
          data: [
            { type: RelationshipType.USERMEMBERS, id: 10 },
            { type: RelationshipType.USERMEMBERS, id: 20 }
          ]
        }
      );
    });

    it('should post the selected agent IDs to the correct relationship endpoint', async () => {
      mockGlobalService.postRelationships.and.returnValue(of({}));
      component.addAgentsForm.patchValue({ agentIds: [5] });

      await component.onAddAgents();

      expect(mockGlobalService.postRelationships).toHaveBeenCalledWith(
        SERV.ACCESS_GROUPS,
        component.editedAccessGroupIndex,
        RelationshipType.AGENTMEMBER,
        {
          data: [{ type: RelationshipType.AGENTMEMBER, id: 5 }]
        }
      );
    });
  });
});
