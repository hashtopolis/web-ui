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
  name: 'tdsearched'
})
export class TaskSearchedPipe implements PipeTransform {

  transform(obj: any, id: number, keyspace: number) {

    if (!obj || !id) {
      return null;
    }

    let ch = obj.values?.filter(u=> u.taskId == id);

    var searched = []

    for(let i=0; i < ch.length; i++){
        searched.push(ch[i].checkpoint - ch[i].skip);
    }

    return searched?.reduce((a, i) => a + i,0)/keyspace;

    }
}

