import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { DataTableDirective } from 'angular-datatables';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';

import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../../core/_services/main.config';
import { UnsubscribeService } from 'src/app/core/_services/unsubscribe.service';
import { displays, filters } from 'src/app/core/_constants/hashes.config';

/**
 * The `HashesComponent` is for managing and displaying a list of hashes
 */
@Component({
  selector: 'app-hashes',
  templateUrl: './hashes.component.html'
})
export class HashesComponent implements OnInit, OnDestroy {
  /** Form group for the Hashes View. */
  viewForm: FormGroup;

  /** Select Options */
  selectFilters = filters;
  selectDisplays = displays;

  // Component Properties
  editMode = false;
  editedIndex: number;
  edited: any; // Change to Model

  // View type and filter options
  whichView: string;
  titleName: any;

  // Filtering and Display Properties
  crackPos: any = true;
  cracked: any;
  filtering = '';
  filteringDescr = '';
  displaying = '';
  displayingDescr = '';
  matchHashes: any;

  // ViewChild reference to the DataTableDirective
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: any = {};

  constructor(
    private unsubscribeService: UnsubscribeService,
    private titleService: AutoTitleService,
    private route: ActivatedRoute,
    private gs: GlobalService,
    private router: Router
  ) {
    titleService.set(['Show Hashes']);
  }

  /**
   * Lifecycle hook called after component initialization.
   */
  ngOnInit(): void {
    this.loadHashes();
    this.setupTable();
  }

  /**
   * Lifecycle hook called before the component is destroyed.
   * Unsubscribes from all subscriptions to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.unsubscribeService.unsubscribeAll();
  }

  buildForm(): void {
    const qp = this.route.snapshot.queryParams;
    if (qp['crackpos']) {
      this.crackPos = qp['crackpos'];
    }
    if (qp['filter']) {
      this.filtering = qp['filter'];
      this.filteringDescr = this.getDescrip(this.filtering, 2);
    }
    if (qp['display']) {
      this.displaying = qp['display'];
      this.displayingDescr = this.getDescrip(this.displaying, 3);
    }
    this.viewForm = new FormGroup({
      display: new FormControl(this.displaying),
      displaydes: new FormControl(this.displayingDescr),
      filter: new FormControl(this.filtering),
      filterdes: new FormControl(this.filteringDescr)
    });

    //subscribe to changes to handle select trigger actions
    this.viewForm.get('display').valueChanges.subscribe((newvalue) => {
      this.onQueryp(newvalue, 0);
    });

    this.viewForm.get('filter').valueChanges.subscribe((newvalue) => {
      this.onQueryp(newvalue, 1);
    });
  }

  getRouterLink(): any[] {
    switch (this.whichView) {
      case 'chunks':
        return ['/tasks/show-tasks/', this.editedIndex, 'edit'];
      case 'tasks':
        return ['/tasks/show-tasks/', this.editedIndex, 'edit'];
      case 'hashlists':
        return ['/hashlists/hashlist/', this.editedIndex, 'edit'];
      default:
        return [];
    }
  }

  // Refresh the data and the DataTable
  onRefresh() {
    this.ngOnInit();
  }

  /**
   * Fetches Hashes from the server
   * Subscribes to the API response and updates the hashes list.
   */
  loadHashes(): void {
    this.route.params.subscribe((params: Params) => {
      this.editedIndex = Number(params['id']);
    });

    this.route.data.subscribe((data) => {
      switch (data['kind']) {
        case 'chunkshash':
          this.whichView = 'chunks';
          this.gs.get(SERV.CHUNKS, this.editedIndex).subscribe((result) => {
            this.titleName = result['chunkId'];
          });
          this.initChashes();
          break;

        case 'taskhas':
          this.whichView = 'tasks';
          this.gs.get(SERV.TASKS, this.editedIndex).subscribe((result) => {
            this.titleName = result['taskName'];
          });
          this.initThashes();
          break;

        case 'hashlisthash':
          this.whichView = 'hashlists';
          this.gs.get(SERV.HASHLISTS, this.editedIndex).subscribe((result) => {
            this.titleName = result['name'];
          });
          this.initHhashes();
          break;
      }
      this.buildForm();
    });
  }

  /**
   * Initialize based on Chunk hashes
   *
   */
  private initChashes() {
    const param = { filter: 'chunkId=' + this.editedIndex + '' };
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
    const param = { filter: 'hashlistId=' + this.editedIndex + '' };
    this.getHashes(param);
  }

  /**
   * Fetch hashes from the server
   *
   */
  async getHashes(param?: any) {
    const params = { maxResults: 90000, expand: 'hashlist,chunk' };

    const nwparams = { ...params, ...param };

    this.gs.getAll(SERV.HASHES, nwparams).subscribe((hashes: any) => {
      let res = hashes.values;
      console.log(this.whichView);
      if (this.whichView === 'tasks') {
        res = res.filter((u) => u.chunk?.taskId == this.editedIndex);
      }
      if (this.filtering === 'cracked') {
        this.matchHashes = res.filter((u) => u.isCracked == true);
      }
      if (this.filtering === 'uncracked') {
        this.matchHashes = res.filter((u) => u.isCracked == false);
      } else {
        this.matchHashes = res;
      }
      this.dtTrigger.next(null);
    });
  }

  // Update query parameters and trigger updates
  onQueryp(name: any, type: number) {
    let query = {};
    if (type == 0) {
      query = { display: name };
    }
    if (type == 1) {
      query = { filter: name };
    }
    this.router.navigate(
      ['/hashlists/hashes/', this.whichView, this.editedIndex],
      { queryParams: query, queryParamsHandling: 'merge' }
    );
    this.onDisplaying(name, type);
    this.ngOnInit();
  }

  // Update display or filter options
  onDisplaying(name: string, type: number) {
    if (type == 0) {
      this.displaying = name;
      this.viewForm.setValue({
        display: this.displaying,
        displaydes: this.getDescrip(name, type)
      });
    }
    if (type == 1) {
      this.filtering = name;
      this.viewForm.setValue({
        filter: this.filtering,
        filterdes: this.getDescrip(name, type)
      });
    }
  }

  // Get the description for filter and display options
  getDescrip(item: string, type: number): string | undefined {
    const selectedArray = type === 0 ? this.selectDisplays : this.selectFilters;
    const selectedItem = selectedArray?.find((obj) => obj?._id === item);

    if (selectedItem) {
      if (type === 0) {
        this.displayingDescr = selectedItem.name;
      } else if (type === 1) {
        this.filteringDescr = selectedItem.name;
      }

      return selectedItem.name;
    }

    return undefined;
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
            className:
              'dt-button buttons-collection btn btn-sm-dt btn-outline-gray-600-dt'
          }
        },
        buttons: [
          {
            extend: 'collection',
            text: 'Export',
            buttons: [
              {
                extend: 'print',
                customize: function (win) {
                  $(win.document.title).css('font-size', '14pt');
                  $(win.document.body).css('font-size', '10pt');
                  $(win.document.body)
                    .find('table')
                    .addClass('compact')
                    .css('font-size', 'inherit');
                }
              },
              {
                extend: 'csvHtml5',
                exportOptions: { modifier: { selected: true } },
                select: true,
                customize: function (dt, csv) {
                  let data = '';
                  for (let i = 0; i < dt.length; i++) {
                    data = 'Hashes Information\n\n' + dt;
                  }
                  return data;
                }
              }
            ]
          }
        ]
      }
    };
  }
}
