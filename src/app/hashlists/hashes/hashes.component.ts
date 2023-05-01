import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HashesService } from 'src/app/core/_services/hashlist/hashes.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { ChunkService } from 'src/app/core/_services/tasks/chunks.service';
import { TasksService } from 'src/app/core/_services/tasks/tasks.sevice';
import { ListsService } from 'src/app/core/_services/hashlist/hashlist.service';

@Component({
  selector: 'app-hashes',
  templateUrl: './hashes.component.html'
})
export class HashesComponent implements OnInit {
  editMode = false;
  editedIndex: number;
  edited: any // Change to Model

  faCopy=faCopy;
  isLoading = false;

  whichView: string;
  titleName: any;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  constructor(
    private hashesService: HashesService,
    private tasksService: TasksService,
    private chunkService: ChunkService,
    private listsService: ListsService,
    private route:ActivatedRoute,
    private router:Router,
  ) { }

  crackPos: any = true;
  cracked:any;
  filtering: string = "";
  filteringDescr: string = "";
  displaying: string = "";
  displayingDescr: string = "";

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

  ngOnInit(): void {

    this.route.params
    .subscribe(
      (params: Params) => {
        this.editedIndex = Number(params['id']);
      }
    );

    this.dtOptions = {
      dom: 'Bfrtip',
      pageLength: 10,
      searching: false,
      buttons: []
    };

    this.route.data.subscribe(data => {
      switch (data['kind']) {

        case 'chunkshash':
          this.whichView = 'chunks';
          this.chunkService.getChunk(this.editedIndex).subscribe((result)=>{this.titleName = result['chunkId']});
          this.initChashes();
        break;

        case 'taskhas':
          this.whichView = 'tasks';
          this.tasksService.getTask(this.editedIndex).subscribe((result)=>{this.titleName = result['taskName']});
          this.initThashes();
        break;

        case 'hashlisthash':
          this.whichView = 'hashlists';
          this.listsService.getHashlist(this.editedIndex).subscribe((result)=>{this.titleName = result['name']});
          this.initHhashes();
        break;

      }
      this.initDisplay();
    });
  }

  private initChashes() {
    this.isLoading = true;
    let param = {'filter': 'chunkId='+this.editedIndex+''};
    this.getHashes(param);
  }

  private initThashes() {
    this.isLoading = true;
    // This should enough to filter by id
    // let param = {'filter': 'taskId='+this.editedIndex+''};
    this.getHashes();
  }

  private initHhashes() {
    this.isLoading = true;
    let param = {'filter': 'hashlistId='+this.editedIndex+''};
    this.getHashes(param);
  }

  async getHashes(param?: any){

    let params = {'maxResults': 90000, 'expand':'hashlist,chunk'};

    const nwparams = {...params, ...param};

    this.hashesService.getAllhashes(nwparams).subscribe((hashes: any) => {
      var res = hashes.values;
      if(this.whichView = 'tasks'){
        res = res.filter(u=> u.chunk.taskId == this.editedIndex);
      }
      if(this.filtering == 'cracked'){
        this.matchHashes = res.filter(u=> u.isCracked == 'true');
      }else{
        this.matchHashes = res;
      }
      this.dtTrigger.next(null);
    });

  }

  viewForm: FormGroup;

  initDisplay(){
    let qp = this.route.snapshot.queryParams;
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

  onOK(){
    this.rerender();
    this.ngOnInit();
  }

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

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      setTimeout(() => {
        this.dtTrigger['new'].next(null);
      });
    });
  }


}
