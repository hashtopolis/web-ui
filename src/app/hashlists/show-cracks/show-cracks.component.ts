import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faPlus} from '@fortawesome/free-solid-svg-icons';
import { environment } from './../../../environments/environment';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { DataTableDirective } from 'angular-datatables';

import { HashesService } from '../../core/_services/hashlist/hashes.service';

@Component({
  selector: 'app-show-cracks',
  templateUrl: './show-cracks.component.html'
})
export class ShowCracksComponent implements OnInit {
  faPlus=faPlus;

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  constructor(
    private hashesService: HashesService
  ) { }

  allhashes: any = [];
  private maxResults = environment.config.prodApiMaxResults

  ngOnInit(): void {

    let params = {'maxResults': this.maxResults, 'filter': 'isCracked=1'}

    this.hashesService.getAllhashes(params).subscribe((hashes: any) => {
      this.allhashes = hashes.values;
      this.dtTrigger.next(void 0);
    });

    this.dtOptions = {
      dom: 'Bfrtip',
      pageLength: 10,
      stateSave: true,
      select: true,
      buttons: {
        dom: {
          button: {
            className: 'dt-button buttons-collection btn btn-sm-dt btn-outline-gray-600-dt',
          }
        },
      buttons: [ 'copy', 'excel', 'csv']
      }
    };

  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }


}
