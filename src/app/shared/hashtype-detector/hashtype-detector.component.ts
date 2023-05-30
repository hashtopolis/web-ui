import { findHashType } from 'hashtype-detector/dist/lib/es6/index';
import { Component } from '@angular/core';

@Component({
  selector: 'app-hashtype-detector',
  templateUrl: './hashtype-detector.component.html'
})
export class HashtypeDetectorComponent  {

  findHashType=findHashType;

  type: any;

  onTest(val){

    var res = findHashType(val);

    if(res === false){

      res = [{
        "regex": "",
        "rAttack": " ",
        "options": [
            {
                "id": 404,
                "description": "Error. No hash type found.",
                "example": ""
            }
        ]
       }]

    }

    this.type = res;
  }

}
