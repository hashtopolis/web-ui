import { HttpErrorResponse } from '@angular/common/http';

/** The server currently identifies an incorrect old password by its problem title. */
export function isIncorrectOldPassword(error: unknown): boolean {
  return (
    error instanceof HttpErrorResponse && error.status === 400 && error.error?.title === 'Your old password is wrong!'
  );
}
