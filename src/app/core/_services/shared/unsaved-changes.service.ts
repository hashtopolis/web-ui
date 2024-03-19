import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UnsavedChangesService {
  private unsavedChanges = false;

  setUnsavedChanges(value: boolean): void {
    this.unsavedChanges = value;
  }

  hasUnsavedChanges(): boolean {
    return this.unsavedChanges;
  }
}
