/* eslint-disable @typescript-eslint/no-explicit-any */
import { SafeHtml } from '@angular/platform-browser';

export interface ReportTableColumn {
  id: number;
  dataKey: string;
  render?: (data: any) => SafeHtml;
}
