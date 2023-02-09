import {
    Injectable,
    Pipe,
    PipeTransform } from '@angular/core';
/*
 * Reusable pipe to get the file type
 * Usage:
 *   value | fileType
 * Example:
 *   {{ 0 | fileType }}
 *   returns: WordList
*/
@Pipe({
    name: 'fileType'
  })
@Injectable({
  providedIn: 'root'
})
export class FileTypePipe implements PipeTransform {

    transform(value: any) {
        switch(value) {

            case "0":
              'Wordlist';
            break;

            case "1":
              'Rules';
            break;

            case "2":
              'Other';
            break;
          }
          'Error'
  }
}

