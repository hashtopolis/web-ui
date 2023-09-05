import { faPlus, faEye } from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

import { UIConfigService } from 'src/app/core/_services/shared/storage.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { environment } from 'src/environments/environment';
import { SERV } from '../../core/_services/main.config';

@Component({
  selector: 'app-chunks',
  templateUrl: './chunks.component.html'
})
@PageTitle(['Show Chunks'])
export class ChunksComponent implements OnInit {

  editedChunkIndex: number;

  faPlus=faPlus;
  faEye=faEye;

  constructor(
    private uiService: UIConfigService,
    private route: ActivatedRoute,
    private gs: GlobalService
  ) { }

  private maxResults = environment.config.prodApiMaxResults;

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  public chunks: {chunkId: number,taskId: number,format: string,skip: number,length: number,agentId: number,dispatchTime: number,solveTime: number,checkpoint: number,progress: number,state: number,cracked: number,speed: number, agentName: string, taskName: string, isEdit: false}[] = [];

  ngOnInit(): void {

    this.chunksInit();

  }

  // Chunk View
  chunkview: number;
  chunkresults: Object;

  chunksInit(){
    let paramchunk = {};

    this.route.data.subscribe(data => {
      switch (data['kind']) {

        case 'chunks':
          this.chunkview = 0;
          this.chunkresults = this.maxResults;
          paramchunk = {'maxResults': this.chunkresults };
        break;

        case 'chunks-view':
          this.chunkview = 1;
          this.chunkresults = this.maxResults;
          this.route.params
          .subscribe(
            (params: Params) => {
              this.editedChunkIndex = +params['id'];
            }
          );
          paramchunk = {'maxResults': this.chunkresults, 'filter': 'chunkId='+this.editedChunkIndex+''};
        break;

        case 'chunks-cAll':
          this.chunkview = 2;
          this.chunkresults = 10000;
          paramchunk = {'maxResults': this.chunkresults };
        break;

      }
    });

    const params = {'maxResults': this.chunkresults};
    this.gs.getAll(SERV.CHUNKS,paramchunk).subscribe((chunks: any) => {
      this.gs.getAll(SERV.TASKS,params).subscribe((tasks: any) => {
      this.gs.getAll(SERV.AGENTS,params).subscribe((agents: any) => {
        this.chunks = chunks.values.map(mainObject => {
          const matchAObject = agents.values.find(element => element.agentId === mainObject.agentId)
          const matchTObject = tasks.values.find(element => element.taskId === mainObject.taskId)
          return { ...mainObject, ...matchAObject, ...matchTObject }
        })
        this.dtTrigger.next(void 0);
        });
      });
    });

    const self = this;
    this.dtOptions = {
      dom: 'Bfrtip',
      pageLength: 10,
      select: true,
      processing: true,
      deferRender: true,
      destroy:true,
      buttons: {
        dom: {
          button: {
            className: 'dt-button buttons-collection btn btn-sm-dt btn-outline-gray-600-dt'
          }
        },
      buttons: [
        {
          text: '↻',
          autoClose: true,
          action: function (e, dt, node, config) {
            self.onRefresh();
          }
        },
        {
          extend: 'collection',
          text: 'Export',
          buttons: [
            {
              extend: 'excelHtml5',
            },
            {
              extend: 'print',
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
                let data = "";
                for (let i = 0; i < dt.length; i++) {
                  data = "Chunks\n\n"+  dt;
                }
                return data;
             }
            },
            {
              extend: 'copy',
            }
            ]
          },
          {
            extend: 'colvis',
            text: 'Column View',
            columns: [ 1,2,3,4,5,6,7,8,9,10,11 ],
          },
          {
            extend: "pageLength",
            className: "btn-sm"
          },
        ],
      }
    };
  }

  onRefresh(){
    this.rerender();
    this.ngOnInit();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      setTimeout(() => {
        this.dtTrigger['new'].next();
      });
    });
  }


}
