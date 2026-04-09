import { Pipe, PipeTransform } from '@angular/core';

import { JHash } from '@models/hash.model';

/**
 * Returns search value over chunks
 * @param obj - Object of chunks
 * @param id - Task Id
 **/

@Pipe({
  name: 'hashesf',
  standalone: false
})
export class HashesFilterPipe implements PipeTransform {
  transform(obj: JHash, display: string, filter: string, crackpos: string): string[] {
    const output: string[] = [];
    if (display == '') {
      if (filter == 'cracked' || filter == '' || filter == 'uncracked') {
        if (obj.isCracked == true) {
          output.push(obj.hash + ':' + obj.plaintext);
        }
      }
    } else if (display == 'hash') {
      output.push(obj.hash);
      if (obj.salt.length > 0) {
        output.push(obj.salt);
      }
    } else if (display == 'plain') {
      output.push(obj.plaintext);
    } else if (display == 'hpc') {
      output.push(obj.hash + ':' + obj.plaintext + ':' + obj.crackPos);
    } else if (display == 'hc') {
      output.push(obj.hash + ':' + obj.crackPos);
    } else if (display == 'pc') {
      output.push(obj.plaintext + ':' + obj.crackPos);
    }
    return output;
  }
}
