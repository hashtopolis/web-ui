import {
    PipeTransform,
    Injectable,
    Pipe,
} from '@angular/core';

/**
 * Reusable pipe to get the file type edit route
 * @param value - The input id number linked with the file type
 * Usage:
 *   value | fileTypeEdit
 * Example:
 *   {{ 0 | fileTypeEdit }}
 * @returns wordlist-edit
**/

@Pipe({
    name: 'fileTypeEdit'
  })
@Injectable({
  providedIn: 'root'
})
export class FileTypeEditPipe implements PipeTransform {

    transform(value: any) {
        switch(value) {

            case 0:
              'wordlist-edit';
            break;

            case 1:
              'rules-edit';
            break;

            case 2:
              'other-edit';
            break;
          }
          'Error'
  }
}

