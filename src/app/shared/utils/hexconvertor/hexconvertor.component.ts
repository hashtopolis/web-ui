import { Component } from '@angular/core';

@Component({
    selector: 'app-hexconvertor',
    templateUrl: './hexconvertor.component.html',
    standalone: false
})
export class HexconvertorComponent {
  hexVal: string = '';

  hexConv(hex: string) {
    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    this.hexVal = str;
  }

  onClear() {
    const elem = document.getElementById('hexval') as HTMLInputElement;
    if (elem.value != '') {
      elem.value = '';
      this.hexVal = '';
    }
  }
}
