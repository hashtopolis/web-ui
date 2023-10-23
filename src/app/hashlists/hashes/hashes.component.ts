import { Component, OnInit,OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { DataTableDirective } from 'angular-datatables';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject,Subscription } from 'rxjs';

import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../core/_services/main.config';

@Component({
  selector: 'app-hashes',
  templateUrl: './hashes.component.html'
})
/**
* The `HashesComponent` is an Angular component responsible for managing and displaying a list of hashes
* with various filtering and display options using the DataTables library. This documentation provides
* an overview of the component's structure and functionality.
*/
export class HashesComponent implements OnInit,OnDestroy {

  // Component Properties
  editMode = false;
  editedIndex: number;
  edited: any // Change to Model

  // Font Awesome icons
  faCopy=faCopy;

  // ViewChild reference to the DataTableDirective
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  // Subscriptions to unsubscribe on component destruction
  subscriptions: Subscription[] = []

  // View type and filter options
  whichView: string;
  titleName: any;

  constructor(
    private titleService: AutoTitleService,
    private route:ActivatedRoute,
    private gs: GlobalService,
    private router:Router
  ) {
    titleService.set(['Show Hashes'])
  }

  // Filtering and Display Properties
  crackPos: any = true;
  cracked:any;
  filtering = "";
  filteringDescr = "";
  displaying = "";
  displayingDescr = "";

  // Filter and Display Options
  filters: any = [{"name":"cracked", "description":"Cracked"},{"name":"uncracked", "description": "Uncracked"},{"name":"", "description": "All"}];
  displays: any = [
    {"name":"", "description": "Hashes + Plaintexts"},
    {"name":"hash", "description":"Hashes only"},
    {"name":"plain","description": "Plaintexts only"},
    {"name":"hpc","description": "Hashes + Plaintexts + Crackposition"},
    {"name":"hc","description": "Hashes + Crackposition"},
    {"name":"pc","description": "Plaintexts + Crackposition"}
  ];

  matchHashes:any;

  /**
   * Initializes DataTable and retrieves hashes..
  */

  ngOnInit(): void {
    this.loadHashes();
    this.setupTable();
  }

  /**
   * Unsubscribes from active subscriptions.
   */
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  // Refresh the data and the DataTable
  onRefresh() {
    this.rerender();
    this.ngOnInit();
  }

  /**
   * Rerender the DataTable.
  */
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      setTimeout(() => {
        this.dtTrigger['new'].next();
      });
    });
  }

  /**
   * Fetches Hashes from the server
   * Subscribes to the API response and updates the hashes list.
  */
  loadHashes(): void {
    this.route.params
    .subscribe(
      (params: Params) => {
        this.editedIndex = Number(params['id']);
      }
    );

    this.route.data.subscribe(data => {
      switch (data['kind']) {

        case 'chunkshash':
          this.whichView = 'chunks';
          this.subscriptions.push(this.gs.get(SERV.CHUNKS,this.editedIndex).subscribe((result)=>{this.titleName = result['chunkId']}));
          this.initChashes();
        break;

        case 'taskhas':
          this.whichView = 'tasks';
          this.subscriptions.push(this.gs.get(SERV.TASKS,this.editedIndex).subscribe((result)=>{this.titleName = result['taskName']}));
          this.initThashes();
        break;

        case 'hashlisthash':
          this.whichView = 'hashlists';
          this.subscriptions.push(this.gs.get(SERV.HASHLISTS,this.editedIndex).subscribe((result)=>{this.titleName = result['name']}));
          this.initHhashes();
        break;

      }
      this.initDisplay();
    });
  }

  /**
   * Sets up the DataTable options and buttons.
   * Customizes DataTable appearance and behavior.
   */
  setupTable(): void {
    // DataTables options
  this.dtOptions = {
    dom: 'Bfrtip',
    scrollX: true,
    pageLength: 25,
    lengthMenu: [
        [10, 25, 50, 100, 250, -1],
        [10, 25, 50, 100, 250, 'All']
    ],
    searching: false,
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
              extend: 'print',
              customize: function ( win ) {
                $(win.document.title)
                    .css( 'font-size', '14pt' )
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
                  data = "Hashes Information\n\n"+  dt;
                }
                return data;
             }
            }
            ]
          },
        ],
      }
    }
  }

  /**
   * Initialize based on Chunk hashes
   *
  */
  private initChashes() {
    const param = {'filter': 'chunkId='+this.editedIndex+''};
    this.getHashes(param);
  }

  /**
   * Initialize based on Tasks hashes
   *
  */
  private initThashes() {
    // This should enough to filter by id
    // let param = {'filter': 'taskId='+this.editedIndex+''};
    this.getHashes();
  }

  /**
   * Initialize based on Hashlists hashes
   *
  */
  private initHhashes() {
    const param = {'filter': 'hashlistId='+this.editedIndex+''};
    this.getHashes(param);
  }

  /**
   * Fetch hashes from the server
   *
  */
  async getHashes(param?: any){

    const params = {'maxResults': 90000, 'expand':'hashlist,chunk'};

    const nwparams = {...params, ...param};

    this.subscriptions.push(this.gs.getAll(SERV.HASHES,nwparams).subscribe((hashes: any) => {
      let res = hashes.values;
      console.log(this.whichView);
      if(this.whichView === 'tasks'){
        res = res.filter(u=> u.chunk?.taskId == this.editedIndex);
      }
      if(this.filtering === 'cracked'){
        this.matchHashes = res.filter(u=> u.isCracked == true);
      }
      if(this.filtering === 'uncracked'){
        this.matchHashes = res.filter(u=> u.isCracked == false);
      }
      else{
        this.matchHashes = res;
      }
      this.dtTrigger.next(null);
    }));

  }

  // Initialize the form for display and filter options

  viewForm: FormGroup;

  initDisplay(){
    const qp = this.route.snapshot.queryParams;
    if(qp['crackpos']){
      this.crackPos = qp['crackpos'];
    }if(qp['filter']){
      this.filtering = qp['filter'];
      this.filteringDescr = this.getDescrip(this.filtering,2);
    }if(qp['display']){
      this.displaying = qp['display'];
      this.displayingDescr = this.getDescrip(this.displaying,3);
    }
    this.viewForm = new FormGroup({
      'display': new FormControl(this.displaying),
      'displaydes': new FormControl(this.displayingDescr),
      'filter': new FormControl(this.filtering),
      'filterdes': new FormControl(this.filteringDescr),
    });
  }

  // Update query parameters and trigger updates
  onQueryp(name: any, type: number){
    let query = {}
    if(type == 0){
     query = {display: name}
    }if(type == 1){
     query = {filter: name}
    }
    this.router.navigate(['/hashlists/hashes/',this.whichView,this.editedIndex], {queryParams: query, queryParamsHandling: 'merge'});
    this.onDisplaying(name, type);
    this.rerender();
    this.ngOnInit();
  }

  // Update display or filter options
  onDisplaying(name: string, type:number){
    if(type == 0){
      this.displaying = name;
      this.viewForm.setValue({
        display: this.displaying,
        displaydes: this.getDescrip(name, type)
      });
    }if(type == 1){
      this.filtering = name;
      this.viewForm.setValue({
        filter: this.filtering,
        filterdes: this.getDescrip(name, type)
      });
    }
  }

  // Get the description for filter and display options
  getDescrip(item: string, type:number){
    if(type == 0){
      this.displayingDescr = this.displays.find(obj => obj.name === item).description;
    }if(type == 1){
      this.filteringDescr = this.filters.find(obj => obj.name === item).description;
    }if(type == 2){
      return this.filters.find(obj => obj.name === item).description;
    }if(type == 3){
      return this.displays.find(obj => obj.name === item).description;
    }
  }

}
