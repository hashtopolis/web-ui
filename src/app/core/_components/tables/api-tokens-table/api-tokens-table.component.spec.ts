import { firstValueFrom, of, throwError } from 'rxjs';
import type { MockedObject } from 'vitest';

import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';

import { JApiToken } from '@models/api-token.model';

import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { PermissionService } from '@services/permission/permission.service';
import { ApiTokensRoleService } from '@services/roles/user/api-tokens-role.service';
import { AlertService } from '@services/shared/alert.service';

import { ApiTokensTableComponent } from '@components/tables/api-tokens-table/api-tokens-table.component';
import {
  API_TOKEN_NAME_MAX_LENGTH,
  ApiTokensRowAction,
  ApiTokensTableCol,
  ApiTokensTableColumnLabel,
  ApiTokensTableEditableAction
} from '@components/tables/api-tokens-table/api-tokens-table.constants';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';
import { TableDialogComponent } from '@components/tables/table-dialog/table-dialog.component';

import { ApiTokensDataSource } from '@datasources/api-tokens.datasource';

@Component({
  template: '',
  standalone: false
})
class TestApiTokensTableComponent extends ApiTokensTableComponent {
  override ngOnInit(): void {
    this.setColumnLabels(ApiTokensTableColumnLabel);
    this.tableColumns = this.getColumns();
  }
}

function token(overrides: Partial<JApiToken> = {}): JApiToken {
  return {
    id: 7,
    type: 'apiToken',
    startValid: 1_700_000_000,
    endValid: 4_102_444_800,
    userId: 3,
    isRevoked: false,
    tokenName: 'Build key',
    user: { id: 3, type: 'user', name: 'admin' },
    ...overrides
  } as JApiToken;
}

describe('ApiTokensTableComponent', () => {
  let component: TestApiTokensTableComponent;
  let fixture: ComponentFixture<TestApiTokensTableComponent>;
  let mockGlobalService: MockedObject<GlobalService>;
  let mockAlertService: MockedObject<AlertService>;
  let mockDialog: MockedObject<MatDialog>;
  let mockRoleService: MockedObject<ApiTokensRoleService>;

  beforeEach(async () => {
    mockGlobalService = {
      update: vi.fn().mockName('GlobalService.update'),
      delete: vi.fn().mockName('GlobalService.delete')
    } as MockedObject<GlobalService>;
    mockGlobalService.update.mockReturnValue(of({}) as never);
    mockGlobalService.delete.mockReturnValue(of({}) as never);
    mockAlertService = {
      showErrorMessage: vi.fn().mockName('AlertService.showErrorMessage'),
      showInfoMessage: vi.fn().mockName('AlertService.showInfoMessage'),
      showSuccessMessage: vi.fn().mockName('AlertService.showSuccessMessage')
    } as MockedObject<AlertService>;
    mockDialog = {
      open: vi.fn().mockName('MatDialog.open')
    } as MockedObject<MatDialog>;
    mockRoleService = {
      hasRole: vi.fn().mockName('ApiTokensRoleService.hasRole')
    } as MockedObject<ApiTokensRoleService>;
    mockRoleService.hasRole.mockReturnValue(true);

    await TestBed.configureTestingModule({
      declarations: [TestApiTokensTableComponent, ApiTokensTableComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: GlobalService, useValue: mockGlobalService },
        { provide: AlertService, useValue: mockAlertService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: ApiTokensRoleService, useValue: mockRoleService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .overrideComponent(ApiTokensTableComponent, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(TestApiTokensTableComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
  });

  function column(id: ApiTokensTableCol): HTTableColumn {
    return component.tableColumns.find((candidate) => candidate.id === id)!;
  }

  function confirmDialog(action: string, row: JApiToken): void {
    vi.mocked(mockDialog.open, { partial: true }).mockReturnValue({
      afterClosed: () => of({ action, data: [row] })
    });
  }

  it('creates columns for each labeled API token field', () => {
    expect(component.tableColumns.map((item) => item.id)).toStrictEqual(
      Object.keys(ApiTokensTableColumnLabel).map(Number)
    );
  });

  it('initializes the real lifecycle, loads once, and forwards filter errors until destroyed', async () => {
    vi.useFakeTimers();
    vi.spyOn(TestBed.inject(PermissionService), 'hasAllPermissionsSync').mockReturnValue(true);
    const setColumns = vi.spyOn(ApiTokensDataSource.prototype, 'setColumns');
    const loadAll = vi.spyOn(ApiTokensDataSource.prototype, 'loadAll').mockImplementation(() => undefined);
    const lifecycleFixture = TestBed.createComponent(ApiTokensTableComponent);
    const lifecycleComponent = lifecycleFixture.componentInstance;

    expect(lifecycleComponent.dataSource).toBeUndefined();
    expect(loadAll).not.toHaveBeenCalled();

    lifecycleFixture.detectChanges();

    expect(lifecycleComponent.dataSource).toBeInstanceOf(ApiTokensDataSource);
    expect(lifecycleComponent.tableColumns.map((item) => item.id)).toStrictEqual(
      Object.keys(ApiTokensTableColumnLabel).map(Number)
    );
    expect(lifecycleComponent['columnLabels']).toStrictEqual(ApiTokensTableColumnLabel);
    expect(setColumns).toHaveBeenCalledExactlyOnceWith(lifecycleComponent.tableColumns);
    expect(setColumns.mock.instances[0]).toBe(lifecycleComponent.dataSource);
    expect(lifecycleComponent['contextMenuService'].getMenuItems()).toStrictEqual([
      expect.objectContaining({
        menuItem: expect.objectContaining({ action: ApiTokensRowAction.REVOKE }),
        condition: { key: 'isActive', value: true }
      }),
      expect.objectContaining({
        menuItem: expect.objectContaining({ action: 'delete' }),
        condition: { key: 'isExpired', value: true }
      })
    ]);
    expect(loadAll).toHaveBeenCalledExactlyOnceWith();
    expect(loadAll.mock.instances[0]).toBe(lifecycleComponent.dataSource);

    lifecycleFixture.detectChanges();
    expect(loadAll).toHaveBeenCalledTimes(1);

    const setFilterError = vi.fn().mockName('HTTableComponent.setFilterError');
    lifecycleComponent.table = { setFilterError } as unknown as typeof lifecycleComponent.table;
    lifecycleComponent.dataSource.filterError$.next('Invalid token filter');
    await vi.advanceTimersByTimeAsync(100);

    expect(setFilterError).toHaveBeenCalledExactlyOnceWith('Invalid token filter');

    lifecycleFixture.destroy();
    lifecycleComponent.dataSource.filterError$.next('Error after destruction');
    await vi.advanceTimersByTimeAsync(100);

    expect(setFilterError).toHaveBeenCalledTimes(1);
  });

  describe('token name column', () => {
    it('provides an editable value and enforces the name length limit when the user can update', () => {
      const editable = column(ApiTokensTableCol.TOKEN_NAME).editable!(token({ tokenName: undefined }));

      expect(editable).toStrictEqual({
        data: token({ tokenName: undefined }),
        value: '',
        action: ApiTokensTableEditableAction.CHANGE_TOKEN_NAME,
        maxLength: API_TOKEN_NAME_MAX_LENGTH
      });
    });

    it('trims and updates a changed name', async () => {
      const row = token();
      const reload = vi.spyOn(component, 'reload').mockReturnValue(undefined as never);

      component.editableSaved({
        data: row,
        value: '  Release key  ',
        action: ApiTokensTableEditableAction.CHANGE_TOKEN_NAME
      });
      await fixture.whenStable();

      expect(mockGlobalService.update).toHaveBeenCalledExactlyOnceWith(SERV.API_TOKENS, row.id, {
        tokenName: 'Release key'
      });
      expect(mockAlertService.showSuccessMessage).toHaveBeenCalledExactlyOnceWith(
        'Renamed API key #7 to "Release key".'
      );
      expect(reload).toHaveBeenCalledExactlyOnceWith();
    });

    it('does not send an update when the name is unchanged', async () => {
      component.editableSaved({
        data: token({ tokenName: 'Build key' }),
        value: '  Build key  ',
        action: ApiTokensTableEditableAction.CHANGE_TOKEN_NAME
      });
      await fixture.whenStable();

      expect(mockGlobalService.update).not.toHaveBeenCalled();
      expect(mockAlertService.showInfoMessage).toHaveBeenCalledExactlyOnceWith('Nothing changed');
    });

    it('rejects names longer than the configured maximum without calling the API', async () => {
      const tooLong = 'x'.repeat(API_TOKEN_NAME_MAX_LENGTH + 1);

      component.editableSaved({
        data: token(),
        value: tooLong,
        action: ApiTokensTableEditableAction.CHANGE_TOKEN_NAME
      });
      await fixture.whenStable();

      expect(mockGlobalService.update).not.toHaveBeenCalled();
      expect(mockAlertService.showErrorMessage).toHaveBeenCalledExactlyOnceWith(
        `Token name is limited to ${API_TOKEN_NAME_MAX_LENGTH} characters (got ${tooLong.length}).`
      );
    });

    it('accepts a name at the maximum length', async () => {
      const maxLengthName = 'x'.repeat(API_TOKEN_NAME_MAX_LENGTH);

      component.editableSaved({
        data: token(),
        value: maxLengthName,
        action: ApiTokensTableEditableAction.CHANGE_TOKEN_NAME
      });
      await fixture.whenStable();

      expect(mockGlobalService.update).toHaveBeenCalledExactlyOnceWith(SERV.API_TOKENS, 7, {
        tokenName: maxLengthName
      });
    });

    it('reports an API error when renaming fails', async () => {
      mockGlobalService.update.mockReturnValue(
        throwError(() => new HttpErrorResponse({ status: 403, error: { title: 'Permission denied' } })) as never
      );

      component.editableSaved({
        data: token(),
        value: 'New name',
        action: ApiTokensTableEditableAction.CHANGE_TOKEN_NAME
      });
      await fixture.whenStable();

      expect(mockAlertService.showErrorMessage).toHaveBeenCalledExactlyOnceWith(
        'Could not rename API key: Permission denied'
      );
      expect(mockAlertService.showSuccessMessage).not.toHaveBeenCalled();
    });
  });

  describe('status and creator columns', () => {
    it('renders status labels and matching icons for active, revoked, and expired tokens', () => {
      const statusColumn = column(ApiTokensTableCol.STATUS);
      const active = token({ endValid: 4_102_444_800 });
      const revoked = token({ isRevoked: true });
      const expired = token({ endValid: 1 });

      expect(statusColumn.render!(active)).toBe('Active');
      expect(statusColumn.icon!(active)).toStrictEqual({ name: 'check_circle', cls: 'text-ok' });
      expect(statusColumn.render!(revoked)).toBe('Revoked');
      expect(statusColumn.icon!(revoked)).toStrictEqual({ name: 'block', cls: 'text-critical' });
      expect(statusColumn.render!(expired)).toBe('Expired');
      expect(statusColumn.icon!(expired)).toStrictEqual({ name: 'schedule', cls: 'text-warning' });
    });

    it('renders the creator name or the available fallback', async () => {
      const creatorColumn = column(ApiTokensTableCol.CREATOR);

      expect(creatorColumn.render!(token())).toBe('admin');
      expect(creatorColumn.render!(token({ user: null, userId: 3 }))).toBe('—');
      await expect(creatorColumn.export!(token({ user: null, userId: 3 }))).resolves.toBe('3');
    });
  });

  describe('ID column', () => {
    it('exports the ID and links to the API key detail page', async () => {
      const idColumn = column(ApiTokensTableCol.ID);
      const row = token();

      await expect(idColumn.export!(row)).resolves.toBe('7');
      await expect(firstValueFrom(idColumn.routerLink!(row))).resolves.toStrictEqual([
        { routerLink: ['/account', 'api-keys', 7], label: '7' }
      ]);
    });
  });

  describe('row actions', () => {
    it.each([ApiTokensRowAction.REVOKE, 'delete'])(
      'does not modify tokens when the %s dialog is cancelled',
      async (action) => {
        const row = token();
        const reload = vi.spyOn(component, 'reload').mockReturnValue(undefined as never);
        vi.mocked(mockDialog.open, { partial: true }).mockReturnValue({
          afterClosed: () => of(undefined)
        });

        component.rowActionClicked({ data: row, menuItem: { action, label: '' } });
        await fixture.whenStable();

        expect(mockDialog.open).toHaveBeenCalledExactlyOnceWith(
          TableDialogComponent,
          expect.objectContaining({ data: expect.objectContaining({ action, rows: [row] }) })
        );
        expect(mockGlobalService.update).not.toHaveBeenCalled();
        expect(mockGlobalService.delete).not.toHaveBeenCalled();
        expect(mockAlertService.showSuccessMessage).not.toHaveBeenCalled();
        expect(reload).not.toHaveBeenCalled();
      }
    );

    it('opens a warning dialog and revokes the token after confirmation', async () => {
      const row = token();
      const reload = vi.spyOn(component, 'reload').mockReturnValue(undefined as never);
      confirmDialog(ApiTokensRowAction.REVOKE, row);

      component.rowActionClicked({ data: row, menuItem: { action: ApiTokensRowAction.REVOKE, label: '' } });
      await fixture.whenStable();

      expect(mockDialog.open).toHaveBeenCalledExactlyOnceWith(
        TableDialogComponent,
        expect.objectContaining({
          data: expect.objectContaining({
            rows: [row],
            title: 'Revoke API key #7?',
            warn: true,
            action: ApiTokensRowAction.REVOKE
          }),
          width: '450px'
        })
      );
      expect(mockGlobalService.update).toHaveBeenCalledExactlyOnceWith(SERV.API_TOKENS, 7, { isRevoked: true });
      expect(mockAlertService.showSuccessMessage).toHaveBeenCalledExactlyOnceWith('Successfully revoked API key #7.');
      expect(reload).toHaveBeenCalledExactlyOnceWith();
    });

    it('deletes the token after confirmation', async () => {
      const row = token();
      vi.mocked(mockDialog.open, { partial: true }).mockReturnValue({
        afterClosed: () => of({ action: 'delete', data: [row] })
      });
      const reload = vi.spyOn(component, 'reload').mockReturnValue(undefined as never);

      component.rowActionClicked({ data: row, menuItem: { action: 'delete', label: '' } });
      await fixture.whenStable();

      expect(mockGlobalService.delete).toHaveBeenCalledExactlyOnceWith(SERV.API_TOKENS, row.id);
      expect(mockAlertService.showSuccessMessage).toHaveBeenCalledExactlyOnceWith('Successfully deleted API key #7.');
      expect(reload).toHaveBeenCalledExactlyOnceWith();
    });

    it('reports a delete failure without showing success or reloading', async () => {
      const row = token();
      const reload = vi.spyOn(component, 'reload').mockReturnValue(undefined as never);
      mockGlobalService.delete.mockReturnValue(
        throwError(() => new HttpErrorResponse({ status: 403, error: { title: 'Permission denied' } })) as never
      );
      confirmDialog('delete', row);

      component.rowActionClicked({ data: row, menuItem: { action: 'delete', label: '' } });
      await fixture.whenStable();

      expect(mockGlobalService.delete).toHaveBeenCalledExactlyOnceWith(SERV.API_TOKENS, row.id);
      expect(mockAlertService.showErrorMessage).toHaveBeenCalledExactlyOnceWith(
        'Could not delete API key: Permission denied'
      );
      expect(mockAlertService.showSuccessMessage).not.toHaveBeenCalled();
      expect(reload).not.toHaveBeenCalled();
    });

    it('reports a revoke failure without showing success', async () => {
      const row = token();
      mockGlobalService.update.mockReturnValue(
        throwError(() => new HttpErrorResponse({ status: 500, statusText: 'Server error' })) as never
      );
      confirmDialog(ApiTokensRowAction.REVOKE, row);

      component.rowActionClicked({ data: row, menuItem: { action: ApiTokensRowAction.REVOKE, label: '' } });
      await fixture.whenStable();

      expect(mockAlertService.showErrorMessage).toHaveBeenCalledExactlyOnceWith(
        'Could not revoke API key: Server error'
      );
      expect(mockAlertService.showSuccessMessage).not.toHaveBeenCalled();
    });
  });
});
