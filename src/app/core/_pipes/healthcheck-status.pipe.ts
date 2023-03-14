import {
  PipeTransform,
  Pipe
} from '@angular/core';

/**
 * Reusable pipe to get the health check status
 * @param value - The input number linked with the health check status
 * Usage:
 *   value | hc-status
 * Example:
 *   {{ 0 | hc-status }}
 * @returns PENDING
**/

@Pipe({
    name: 'HCstatus'
  })
  export class HealthCheckStatusPipe implements PipeTransform {

    transform(value: any) {
      var status = "";
        switch(value) {

            case 0:
            status = 'RUNNING';
            break;

            case 1:
            status ='COMPLETED';
            break;

            case -1:
            status ='ABORTED';
            break;
          }
          return status;
  }
}
