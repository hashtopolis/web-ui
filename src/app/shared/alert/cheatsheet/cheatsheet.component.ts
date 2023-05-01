import { ModalDismissReasons, NgbModal, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cheatsheet',
  templateUrl: './cheatsheet.component.html'
})
export class CheatsheetComponent implements OnInit {

  constructor(
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
  }

   // Modal Information
   closeResult = '';
   open(content) {
     this.modalService.open(content, { size: 'xl' }).result.then(
       (result) => {
         this.closeResult = `Closed with: ${result}`;
       },
       (reason) => {
         this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
       },
     );
   }

   private getDismissReason(reason: any): string {
     if (reason === ModalDismissReasons.ESC) {
       return 'by pressing ESC';
     } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
       return 'by clicking on a backdrop';
     } else {
       return `with: ${reason}`;
     }
   }

   // Modal Information
     attackmode =[
       {'value': '0', 'name': 'Straight(Using rules)' },
       {'value': '1', 'name': 'Combination' },
       {'value': '3', 'name': 'Brute-force'},
       {'value': '6', 'name': 'Hybrid Dictionary+ Mask'},
       {'value': '7', 'name': 'Hybrid Mask + Dictionary'},
     ]

     attackex =[
       {'value': 'Dictionary', 'example': '-w3 -O #HL# -a 0 rockyou.txt' },
       {'value': 'Dictionary + Rules', 'example': '-w3 -O #HL# -a 0 rockyou.txt -r base64rule.txt' },
       {'value': 'Combination', 'example': '-w3 -O #HL# -a 1 rockyou.txt rockyou2.txt'},
       {'value': 'Hybrid Dictionary + Mask', 'example': '-w3 -O #HL# -a 6 -m dict.txt ?a?a?a?a'},
       {'value': 'Hybrid Mask + Dictionary', 'example': '-w3 -O #HL# -a 7 -m ?a?a?a?a dict.txt'},
     ]

     charsets =[
       {'value': '?l', 'descrip': 'abcdefghĳklmnopqrstuvwxyz' },
       {'value': '?u', 'descrip': 'ABCDEFGHĲKLMNOPQRSTUVWXYZ' },
       {'value': '?d', 'descrip': '0123456789' },
       {'value': '?h', 'descrip': '0123456789abcdef' },
       {'value': '?H', 'descrip': '0123456789ABCDEF' },
       {'value': '?s', 'descrip': '«space»!"#$%&()*+,-./:;<=>?@[\]^_`{|}~'},
       {'value': '?a', 'descrip': '?l?u?d?s'},
       {'value': '?b', 'descrip': '0x00 - 0xff'},
     ]


}
