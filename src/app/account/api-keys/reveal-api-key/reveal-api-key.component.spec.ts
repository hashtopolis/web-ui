import type { MockedObject } from 'vitest';

import { Clipboard } from '@angular/cdk/clipboard';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { AlertService } from '@services/shared/alert.service';

import { RevealApiKeyDialogComponent } from '@src/app/account/api-keys/reveal-api-key/reveal-api-key.component';

describe('RevealApiKeyDialogComponent', () => {
  let component: RevealApiKeyDialogComponent;
  let fixture: ComponentFixture<RevealApiKeyDialogComponent>;

  let mockClipboard: MockedObject<Clipboard>;
  let mockAlert: MockedObject<AlertService>;
  let mockDialogRef: MockedObject<MatDialogRef<RevealApiKeyDialogComponent>>;

  beforeEach(async () => {
    mockClipboard = {
      copy: vi.fn().mockName('Clipboard.copy')
    } as MockedObject<Clipboard>;
    mockAlert = {
      showSuccessMessage: vi.fn().mockName('AlertService.showSuccessMessage'),
      showErrorMessage: vi.fn().mockName('AlertService.showErrorMessage')
    } as MockedObject<AlertService>;
    mockDialogRef = {
      close: vi.fn().mockName('MatDialogRef.close')
    } as MockedObject<MatDialogRef<RevealApiKeyDialogComponent>>;

    await TestBed.configureTestingModule({
      declarations: [RevealApiKeyDialogComponent],
      providers: [
        { provide: Clipboard, useValue: mockClipboard },
        { provide: AlertService, useValue: mockAlert },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { token: 'jwt-abc' } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(RevealApiKeyDialogComponent);
    component = fixture.componentInstance;
  });

  it('exposes the token from MAT_DIALOG_DATA', () => {
    expect(component.token).toBe('jwt-abc');
  });

  it('shows a success message when the clipboard write succeeds', () => {
    mockClipboard.copy.mockReturnValue(true);

    component.copy();

    expect(mockClipboard.copy).toHaveBeenCalledWith('jwt-abc');
    expect(mockAlert.showSuccessMessage).toHaveBeenCalled();
  });

  it('shows an error message when the clipboard write fails', () => {
    mockClipboard.copy.mockReturnValue(false);

    component.copy();

    expect(mockAlert.showErrorMessage).toHaveBeenCalled();
  });

  it('closes the dialog when done() is called', () => {
    component.done();

    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});
