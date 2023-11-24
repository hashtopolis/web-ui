import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ApplicationRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-cheatsheet',
  templateUrl: './cheatsheet.component.html'
})
export class CheatsheetComponent {
  constructor(
    public dialogRef: MatDialogRef<CheatsheetComponent>,
    private appRef: ApplicationRef
  ) {}

  // Display Table Information
  attackmode = [
    { _id: '0', name: 'Straight(Using rules)' },
    { _id: '1', name: 'Combination' },
    { _id: '3', name: 'Brute-force' },
    { _id: '6', name: 'Hybrid Dictionary+ Mask' },
    { _id: '7', name: 'Hybrid Mask + Dictionary' }
  ];

  attackex = [
    { _id: 'Dictionary', name: '-w3 -O #HL# -a 0 rockyou.txt' },
    {
      _id: 'Dictionary + Rules',
      name: '-w3 -O #HL# -a 0 rockyou.txt -r base64rule.txt'
    },
    {
      _id: 'Combination',
      name: '-w3 -O #HL# -a 1 rockyou.txt rockyou2.txt'
    },
    {
      _id: 'Hybrid Dictionary + Mask',
      name: '-w3 -O #HL# -a 6 -m dict.txt ?a?a?a?a'
    },
    {
      _id: 'Hybrid Mask + Dictionary',
      name: '-w3 -O #HL# -a 7 -m ?a?a?a?a dict.txt'
    }
  ];

  charsets = [
    { _id: '?l', name: 'abcdefghĳklmnopqrstuvwxyz' },
    { _id: '?u', name: 'ABCDEFGHĲKLMNOPQRSTUVWXYZ' },
    { _id: '?d', name: '0123456789' },
    { _id: '?h', name: '0123456789abcdef' },
    { _id: '?H', name: '0123456789ABCDEF' },
    { _id: '?s', name: '«space»!"#$%&()*+,-./:;<=>?@[]^_`{|}~' },
    { _id: '?a', name: '?l?u?d?s' },
    { _id: '?b', name: '0x00 - 0xff' }
  ];

  dataSource1 = new MatTableDataSource([...this.attackmode]);

  dataSource2 = new MatTableDataSource([...this.attackex]);

  dataSource3 = new MatTableDataSource([...this.charsets]);

  onClose(): void {
    this.dialogRef.close();
  }
}
