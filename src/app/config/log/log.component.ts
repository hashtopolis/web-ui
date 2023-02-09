import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { faHomeAlt } from '@fortawesome/free-solid-svg-icons';
import { environment } from 'src/environments/environment';

import { UIConfigService } from 'src/app/core/_services/shared/storage.service';
import { LogentryService } from '../../core/_services/config/logentry.service';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html'
})
export class LogComponent implements OnInit {
  faHome=faHomeAlt;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};
  uidateformat:any;

  public logs: {logEntryId: number, issuer: string, issuerId: number, level: string, message: string, time: number}[] = [];

  private maxResults = environment.config.prodApiMaxResults

  constructor(
    private logentryService: LogentryService,
    private uiService: UIConfigService,
    private route:ActivatedRoute,
    private router:Router
  ) { }

    ngOnInit(): void {
      let params = {'maxResults': this.maxResults};
      this.logentryService.getLogs(params).subscribe((log: any) => {
        this.logs = log.values;
        this.dtTrigger.next(void 0);
      });

      this.uidateformat = this.uiService.getUIsettings('timefmt').value;

      this.dtOptions = {
        dom: 'Bfrtip',
        scrollY: true,
        buttons: {
          dom: {
            button: {
              className: 'dt-button buttons-collection btn btn-sm-dt btn-outline-gray-600-dt',
            }
          },
        buttons: [
          {
            extend: 'collection',
            text: 'Export',
            buttons: [
              {
                extend: 'excelHtml5',
                exportOptions: {
                  columns: [0, 1, 2, 3, 4]
                },
              },
              {
                extend: 'print',
                exportOptions: {
                  columns: [0, 1, 2, 3, 4]
                },
                customize: function ( win ) {
                  $(win.document.body)
                      .css( 'font-size', '10pt' )
                  $(win.document.body).find( 'table' )
                      .addClass( 'compact' )
                      .css( 'font-size', 'inherit' );
               }
              },
              {
                extend: 'csvHtml5',
                exportOptions: {modifier: {selected: true}},
                select: true,
                customize: function (dt, csv) {
                  var data = "";
                  for (var i = 0; i < dt.length; i++) {
                    data = "Logs\n\n"+  dt;
                  }
                  return data;
               }
              },
                'copy'
              ]
            }
          ],
        }
      };
    }

}


