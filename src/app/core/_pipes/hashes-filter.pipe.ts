import {
  PipeTransform,
  Pipe
} from '@angular/core';

/**
 * Returns search value over chunks
 * @param obj - Object of chunks
 * @param id - Task Id
**/

@Pipe({
  name: 'hashesf'
})
export class HashesFilterPipe implements PipeTransform {

  transform(obj: any, display: string, filter: string, crackpos: string) {
    var output:any = [];
    if (display == "") {
      if (filter == "cracked" || filter == "" || filter == "uncracked") {
        if (obj.isCracked == true) {
          output.push(obj.hash+':'+obj.plaintext);
        }
      }
    }else if (display == "hash") {
      output.push(obj.hash);
      if (obj.salt.length > 0) {
        output.push(obj.salt);
      }
    }else if (display == "plain") {
      output.push(obj.plaintext);
    }
    else if (display == "hpc") {
      output.push(obj.hash+':'+obj.plaintext+':'+obj.crackPos);
    }
    else if (display == "hc") {
      output.push(obj.hash+':'+obj.crackPos);
    }
    else if (display == "pc") {
      output.push(obj.plaintext+':'+obj.crackPos);
    }
    return output;
    }
}



