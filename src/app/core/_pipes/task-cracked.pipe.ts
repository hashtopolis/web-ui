import {
  PipeTransform,
  Pipe
} from '@angular/core';

/**
 * Returns cracked value iteration over chunks
 * @param obj - Object of chunks
 * @param id - Task Id
**/

@Pipe({
  name: 'tdcracked'
})
export class TaskCrackedPipe implements PipeTransform {

  transform(obj: any, id: number) {

    if (!obj || !id) {
      return null;
    }

    let ch = obj.values?.filter(u=> u.taskId == id);

    var searched = []

    for(let i=0; i < ch.length; i++){
        searched.push(ch[i].cracked);
    }

    return searched?.reduce((a, i) => a + i,0);

    }
}

