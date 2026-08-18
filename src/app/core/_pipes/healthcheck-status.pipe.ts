import { Pipe, PipeTransform } from '@angular/core';

import { HealthCheckStatus } from '@models/health-check.model';

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
  name: 'HCstatus',
  standalone: false
})
export class HealthCheckStatusPipe implements PipeTransform {
  transform(value: number): string {
    let status = '';
    switch (value) {
      case HealthCheckStatus.RUNNING:
        status = 'RUNNING';
        break;

      case HealthCheckStatus.COMPLETED:
        status = 'COMPLETED';
        break;

      case HealthCheckStatus.ABORTED:
        status = 'ABORTED';
        break;
    }
    return status;
  }
}
