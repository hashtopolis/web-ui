import type { MockedObject } from 'vitest';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';

import { ApiKeyRevealStore } from '@services/api-key-reveal.store';
import { ApiTokensRoleService } from '@services/roles/user/api-tokens-role.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

import { ApiKeysComponent } from '@src/app/account/api-keys/api-keys.component';
import { RevealApiKeyDialogComponent } from '@src/app/account/api-keys/reveal-api-key/reveal-api-key.component';

describe('ApiKeysComponent', () => {
  let component: ApiKeysComponent;
  let fixture: ComponentFixture<ApiKeysComponent>;

  let mockStore: MockedObject<ApiKeyRevealStore>;
  let mockDialog: MockedObject<MatDialog>;
  let mockRole: MockedObject<ApiTokensRoleService>;
  let mockTitle: MockedObject<AutoTitleService>;

  beforeEach(async () => {
    mockStore = {
      consume: vi.fn().mockName('ApiKeyRevealStore.consume'),
      set: vi.fn().mockName('ApiKeyRevealStore.set')
    } as MockedObject<ApiKeyRevealStore>;
    mockDialog = {
      open: vi.fn().mockName('MatDialog.open')
    } as MockedObject<MatDialog>;
    mockRole = {
      hasRole: vi.fn().mockName('ApiTokensRoleService.hasRole')
    } as MockedObject<ApiTokensRoleService>;
    mockRole.hasRole.mockReturnValue(true);
    mockTitle = {
      set: vi.fn().mockName('AutoTitleService.set')
    } as MockedObject<AutoTitleService>;

    await TestBed.configureTestingModule({
      declarations: [ApiKeysComponent],
      providers: [
        { provide: ApiKeyRevealStore, useValue: mockStore },
        { provide: MatDialog, useValue: mockDialog },
        { provide: ApiTokensRoleService, useValue: mockRole },
        { provide: AutoTitleService, useValue: mockTitle }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ApiKeysComponent);
    component = fixture.componentInstance;
  });

  it('opens the reveal dialog with the consumed token on init', () => {
    mockStore.consume.mockReturnValue('jwt-abc');

    fixture.detectChanges();

    expect(mockDialog.open).toHaveBeenCalledWith(
      RevealApiKeyDialogComponent,
      expect.objectContaining({ data: { token: 'jwt-abc' }, disableClose: true })
    );
  });

  it('does not open the reveal dialog when the store is empty', () => {
    mockStore.consume.mockReturnValue(null);

    fixture.detectChanges();

    expect(mockDialog.open).not.toHaveBeenCalled();
    expect(component).toBeTruthy();
  });
});
