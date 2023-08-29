import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UIConfigService } from 'src/app/core/_services/shared/storage.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { environment } from './../../../environments/environment';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../core/_services/main.config';

@Component({
  selector: 'app-search-hash',
  templateUrl: './search-hash.component.html'
})
@PageTitle(['Search Hash'])
export class SearchHashComponent implements OnInit {

  faMagnifyingGlass=faMagnifyingGlass;

  constructor(
    private uiService: UIConfigService,
    private gs: GlobalService,
    private router: Router
  ) { }

  createForm: FormGroup;
  uidateformat:any;
  searh: any;

  private maxResults = environment.config.prodApiMaxResults;

  ngOnInit(): void {

    this.uidateformat = this.uiService.getUIsettings('timefmt').value;

    this.createForm = new FormGroup({
      hashes: new FormControl('', [Validators.required]),
    });

  }

  onSubmit(){
    if (this.createForm.valid) {

      let hash = this.createForm.value['hashes'].split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } );
      const arr = [];
      for(let i=0; i < hash.length; i++){

        this.gs.getAll(SERV.HASHES,{'filter':'hash='+hash[i]+''}).subscribe((res: any) => {
            if(res.values[0]){
              arr.push(res.values[0]);
            }else{
              arr.push({'hash':hash[i],'isCracked': 3});
            }
        });

      }

      this.searh = arr;

    }
  }

}
