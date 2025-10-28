import { DataTableDirective } from 'angular-datatables';

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { JChunk } from '@models/chunk.model';
import { JHashlist } from '@models/hashlist.model';
import { ResponseWrapper } from '@models/response.model';
import { JTask } from '@models/task.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AutoTitleService } from '@services/shared/autotitle.service';
import { UnsubscribeService } from '@services/unsubscribe.service';

import { displays, filters } from '@src/app/core/_constants/hashes.config';

/**
 * The `HashesComponent` is for managing and displaying a list of hashes
 */
@Component({
  selector: 'app-hashes',
  templateUrl: './hashes.component.html',
  standalone: false
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

  // View type and filter options
  whichView: string;
  titleName: string;
  filterParam: string;

  // Filtering and Display Properties
  crackPos: any = true;
  filtering = '';
  filteringDescr = '';
  displaying = '';
  displayingDescr = '';

  // ViewChild reference to the DataTableDirective
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

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

  getRouterLink(): (string | number)[] {
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

  /**
   * Fetches Hashes from the server
   * Subscribes to the API response and updates the hashes list.
   */
  loadHashes(): void {
    this.route.params.subscribe((params: Params) => {
      if (params['id'].includes('?')) {
        const split = params['id'].split('?');
        this.editedIndex = Number(split[0]);
        this.filterParam = split[1];
      } else {
        this.editedIndex = Number(params['id']);
      }
    });

    this.route.data.subscribe((data) => {
      switch (data['kind']) {
        case 'chunkshash':
          this.whichView = 'chunks';
          this.gs.get(SERV.CHUNKS, this.editedIndex).subscribe((response: ResponseWrapper) => {
            const chunk = new JsonAPISerializer().deserialize<JChunk>({
              data: response.data,
              included: response.included
            });
            this.titleName = String(chunk.id);
          });
          break;

        case 'taskhas':
          this.whichView = 'tasks';
          this.gs.get(SERV.TASKS, this.editedIndex).subscribe((response: ResponseWrapper) => {
            const task = new JsonAPISerializer().deserialize<JTask>({
              data: response.data,
              included: response.included
            });
            this.titleName = task.taskName;
          });
          break;

        case 'hashlisthash':
          this.whichView = 'hashlists';
          this.gs.get(SERV.HASHLISTS, this.editedIndex).subscribe((response: ResponseWrapper) => {
            const hashlist = new JsonAPISerializer().deserialize<JHashlist>({
              data: response.data,
              included: response.included
            });
            this.titleName = hashlist.name;
          });
          break;
      }
      this.buildForm();
    });
  }

  // Update query parameters and trigger updates
  onQueryp(name: string, type: number) {
    let query = {};
    if (type == 0) {
      query = { display: name };
    }
    if (type == 1) {
      query = { filter: name };
    }
    this.router.navigate(['/hashlists/hashes/', this.whichView, this.editedIndex], {
      queryParams: query,
      queryParamsHandling: 'merge'
    });
    this.onDisplaying(name, type);
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
}
