import {
    PipeTransform,
    Injectable,
    Pipe,
} from '@angular/core';

/**
 * Reusable pipe to get the file type
 * @param value - The input id number linked with the file type
 * Usage:
 *   value | fileType
 * Example:
 *   {{ 0 | fileType }}
 * @returns WordList
**/

@Pipe({
    name: 'fileType'
  })
@Injectable({
  providedIn: 'root'
})
export class FileTypePipe implements PipeTransform {

    transform(value: any, edit?: boolean) {
      var res = "";
        switch(value) {

            case 0:
              res = 'Wordlist';
              if(edit == true){res = 'wordlist-edit'}
            break;

            case 1:
              res ='Rules';
              if(edit == true){res = 'rules-edit'}
            break;

            case 2:
              res = 'Other';
              if(edit == true){res = 'other-edit'}
            break;
          }
          return res;
  }
}
