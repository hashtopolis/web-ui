import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AlertService } from '@services/shared/alert.service';

describe('AlertService', () => {
  let service: AlertService;
  let openSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    openSpy = vi.fn().mockName('MatSnackBar.open');
    TestBed.configureTestingModule({
      providers: [AlertService, { provide: MatSnackBar, useValue: { open: openSpy } }]
    });
    service = TestBed.inject(AlertService);
  });

  it('shows a success message with the default duration', () => {
    const message = 'Changes saved';

    service.showSuccessMessage(message);

    expect(openSpy).toHaveBeenCalledExactlyOnceWith(message, 'Close', {
      duration: 10000,
      panelClass: 'snackbar-success'
    });
  });

  it('shows an error message with the default duration', () => {
    const message = 'Could not save changes';

    service.showErrorMessage(message);

    expect(openSpy).toHaveBeenCalledExactlyOnceWith(message, 'Close', {
      duration: 10000,
      panelClass: 'snackbar-error'
    });
  });

  it('shows an info message for five seconds', () => {
    const message = 'Synchronization started';

    service.showInfoMessage(message);

    expect(openSpy).toHaveBeenCalledExactlyOnceWith(message, 'Close', {
      duration: 5000,
      panelClass: 'snackbar-info'
    });
  });
});
