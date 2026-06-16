import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { JHashlist } from '@models/hashlist.model';
import { HashTypeId, HashlistId } from '@models/id.types';

/**
 * Creates a validator that ensures all selected hashlists share the same hashTypeId.
 *
 * Uses a getter callback function so that newly created form still returns the latest values.
 * -> Could probably be improved, hotfix for the release 1.0.
 * @param getHashlists Returns the currently loaded hashlists used to look up hashTypeId per id.
 */
export function sameHashTypeValidator(getHashlists: () => JHashlist[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as HashlistId[] | null;

    if (!Array.isArray(value) || value.length < 2) {
      return null;
    }

    const hashlists = getHashlists();

    if (!hashlists.length) {
      return null;
    }

    const distinctHashTypes = new Set(
      value
        .map((id) => hashlists.find((h) => h.id === id)?.hashTypeId)
        .filter((hashTypeId): hashTypeId is HashTypeId => hashTypeId !== undefined)
    );

    return distinctHashTypes.size > 1 ? { mixedHashTypes: true } : null;
  };
}
