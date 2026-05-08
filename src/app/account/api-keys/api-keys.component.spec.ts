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

  let mockStore: jasmine.SpyObj<ApiKeyRevealStore>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockRole: jasmine.SpyObj<ApiTokensRoleService>;
  let mockTitle: jasmine.SpyObj<AutoTitleService>;

  beforeEach(async () => {
    mockStore = jasmine.createSpyObj('ApiKeyRevealStore', ['consume', 'set']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockRole = jasmine.createSpyObj('ApiTokensRoleService', ['hasRole']);
    mockRole.hasRole.and.returnValue(true);
    mockTitle = jasmine.createSpyObj('AutoTitleService', ['set']);

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
    mockStore.consume.and.returnValue('jwt-abc');

    fixture.detectChanges();

    expect(mockDialog.open).toHaveBeenCalledWith(
      RevealApiKeyDialogComponent,
      jasmine.objectContaining({ data: { token: 'jwt-abc' }, disableClose: true })
    );
  });

  it('does not open the reveal dialog when the store is empty', () => {
    mockStore.consume.and.returnValue(null);

    fixture.detectChanges();

    expect(mockDialog.open).not.toHaveBeenCalled();
    expect(component).toBeTruthy();
  });
});
