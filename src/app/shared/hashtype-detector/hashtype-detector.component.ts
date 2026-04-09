import { findHashType } from 'hashtype-detector/dist/lib/es6/index';

import { BreakpointObserver } from '@angular/cdk/layout';
import { ApplicationRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

interface HashTypeOption {
  id: number;
  description: string;
  example?: string;
}

interface HashTypeMatch {
  regex: string;
  rAttack: string;
  options: HashTypeOption[];
}

@Component({
  selector: 'hashtype-detector',
  templateUrl: './hashtype-detector.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: false
})
export class HashtypeDetectorComponent implements OnInit {
  type: HashTypeMatch[] | false;
  displayedColumns: string[] = ['id', 'description', 'example'];
  dataSource: MatTableDataSource<HashTypeOption>;

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
      this.type = result as HashTypeMatch[];
      this.dataSource.data = this.flattenData();
      this.appRef.tick();
    }
  }

  flattenData(): HashTypeOption[] {
    const flattenedData: HashTypeOption[] = [];

    if (this.type) {
      for (const n of this.type) {
        for (const nn of n.options) {
          flattenedData.push(nn);
        }
      }
    }

    return flattenedData;
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<HashTypeOption>([]);
  }
}
