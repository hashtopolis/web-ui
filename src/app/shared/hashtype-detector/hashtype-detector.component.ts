import {
  ApplicationRef,
  ChangeDetectorRef,
  Component,
  ViewEncapsulation
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogRef } from '@angular/material/dialog';
import { findHashType } from 'hashtype-detector/dist/lib/es6/index';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
    selector: 'hashtype-detector',
    templateUrl: './hashtype-detector.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class HashtypeDetectorComponent {
  type: any;
  displayedColumns: string[] = ['id', 'description', 'example'];
  dataSource: MatTableDataSource<any>;

  constructor(
    public dialogRef: MatDialogRef<HashtypeDetectorComponent>,
    private appRef: ApplicationRef,
    private breakpointObserver: BreakpointObserver
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  onSearch(val: string): void {
    const result = findHashType(val);
    if (result === false || result === 'No hashes found.') {
      this.type = false;
    } else {
      this.type = result;
      this.dataSource.data = this.flattenData();
      this.appRef.tick();
    }
  }

  flattenData(): any[] {
    const flattenedData: any[] = [];

    if (this.type && this.type !== false) {
      for (const n of this.type) {
        for (const nn of n.options) {
          flattenedData.push(nn);
        }
      }
    }

    return flattenedData;
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource([]);
  }
}
