import { AbstractControl } from '@angular/forms';

export class ValidationService {

/*
 * Validates email using RFC 2822
 * If fail returns:
 *     invalidEmailAddress
 *
*/
    static emailValidator(control: AbstractControl) {
        if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
            return null;
        } else {
            return { 'invalidEmailAddress': true };
        }
    }

/*
 * Validates password using minimum security parameters
 * {6,100} - Assert password is between 6 and 100 characters
 * (?!.*\s) - Spaces are not allowed
 * If fail returns:
 *     invalidPassword
 *
*/
    static passwordValidator(control: AbstractControl) {
        if (control.value.match(/^(?=.*\d)(?=.*[a-zA-Z!@#$%^&*])(?!.*\s).{6,100}$/)) {
            return null;
        } else {
            return { 'invalidPassword': true };
        }
    }


}
