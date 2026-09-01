import { zChunkResponse, zHashlistResponse, zTaskResponse } from '@generated/api/zod';

import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { JChunk } from '@models/chunk.model';
import { JHashlist } from '@models/hashlist.model';
import { ResponseWrapper } from '@models/response.model';
import {
  HashesRouteKind,
  zHashesQueryParams,
  zHashesRouteData,
  zHashesRouteParams,
  zRouteId
} from '@models/routes.schema';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

import { HashesSelectKind, HashesViewType, displays, filters } from '@src/app/core/_constants/hashes.config';

export interface HashesViewForm {
  display: FormControl<string | null>;
  displaydes: FormControl<string | null>;
  filter: FormControl<string | null>;
  filterdes: FormControl<string | null>;
}

/**
 * The `HashesComponent` is for managing and displaying a list of hashes
 */
@Component({
  selector: 'app-hashes',
  templateUrl: './hashes.component.html',
  standalone: false
})
export class HashesComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private titleService = inject(AutoTitleService);
  private route = inject(ActivatedRoute);
  private gs = inject(GlobalService);
  private router = inject(Router);

  /** Form group for the Hashes View. */
  viewForm: FormGroup<HashesViewForm>;

  /** Select Options */
  selectFilters = filters;
  selectDisplays = displays;

  // Component Properties
  editMode = false;
  editedIndex: number;

  // View type and filter options
  whichView: HashesViewType;
  protected readonly HashesViewType = HashesViewType;
  titleName: string;
  filterParam: string;

  // Filtering and Display Properties
  crackPos: boolean | string = true;
  filtering = '';
  filteringDescr = '';
  displaying = '';
  displayingDescr = '';

  constructor() {
    const titleService = this.titleService;

    titleService.set(['Show Hashes']);
  }

  /**
   * Lifecycle hook called after component initialization.
   */
  ngOnInit(): void {
    this.loadHashes();
  }

  buildForm(): void {
    const qp = zHashesQueryParams.parse(this.route.snapshot.queryParams);
    if (qp.crackpos) {
      this.crackPos = qp.crackpos;
    }
    if (qp.filter) {
      this.filtering = qp.filter;
      this.filteringDescr = this.getDescrip(this.filtering, HashesSelectKind.FILTER) ?? '';
    }
    if (qp.display) {
      this.displaying = qp.display;
      this.displayingDescr = this.getDescrip(this.displaying, HashesSelectKind.DISPLAY) ?? '';
    }
    this.viewForm = new FormGroup<HashesViewForm>({
      display: new FormControl<string | null>(this.displaying),
      displaydes: new FormControl<string | null>(this.displayingDescr),
      filter: new FormControl<string | null>(this.filtering),
      filterdes: new FormControl<string | null>(this.filteringDescr)
    });

    //subscribe to changes to handle select trigger actions
    this.viewForm.controls.display.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((newvalue) => {
      this.onQueryp(newvalue ?? '', HashesSelectKind.DISPLAY);
    });

    this.viewForm.controls.filter.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((newvalue) => {
      this.onQueryp(newvalue ?? '', HashesSelectKind.FILTER);
    });
  }

  getRouterLink(): (string | number)[] {
    switch (this.whichView) {
      case HashesViewType.CHUNKS:
        return ['/tasks/show-tasks/', this.editedIndex, 'edit'];
      case HashesViewType.TASKS:
        return ['/tasks/show-tasks/', this.editedIndex, 'edit'];
      case HashesViewType.HASHLISTS:
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
    this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params: Params) => {
      const [rawId, filterParam] = zHashesRouteParams.parse(params).id.split('?');
      this.editedIndex = zRouteId.parse(rawId);
      if (filterParam) {
        this.filterParam = filterParam;
      }
    });

    this.route.data.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
      const routeDataKind = zHashesRouteData.parse(data).kind;
      switch (routeDataKind) {
        case HashesRouteKind.ChunkHashes:
          this.whichView = HashesViewType.CHUNKS;
          this.gs
            .get(SERV.CHUNKS, this.editedIndex)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((response: ResponseWrapper) => {
              const chunk: JChunk = new JsonAPISerializer().deserialize(response, zChunkResponse);
              this.titleName = String(chunk.id);
            });
          break;

        case HashesRouteKind.TaskHashes:
          this.whichView = HashesViewType.TASKS;
          this.gs
            .get(SERV.TASKS, this.editedIndex)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((response: ResponseWrapper) => {
              const task = new JsonAPISerializer().deserialize(response, zTaskResponse);
              this.titleName = task.taskName ?? '';
            });
          break;

        case HashesRouteKind.HashlistHashes:
          this.whichView = HashesViewType.HASHLISTS;
          this.gs
            .get(SERV.HASHLISTS, this.editedIndex)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((response: ResponseWrapper) => {
              const hashlist: JHashlist = new JsonAPISerializer().deserialize(response, zHashlistResponse);
              this.titleName = hashlist.name;
            });
          break;
      }
      this.buildForm();
    });
  }

  // Update query parameters and trigger updates
  onQueryp(name: string, type: HashesSelectKind) {
    let query = {};
    if (type === HashesSelectKind.DISPLAY) {
      query = { display: name };
    }
    if (type === HashesSelectKind.FILTER) {
      query = { filter: name };
    }
    this.router.navigate(['/hashlists/hashes/', this.whichView, this.editedIndex], {
      queryParams: query,
      queryParamsHandling: 'merge'
    });
    this.onDisplaying(name, type);
  }

  // Update display or filter options
  onDisplaying(name: string, type: HashesSelectKind) {
    if (type === HashesSelectKind.DISPLAY) {
      this.displaying = name;
      this.viewForm.patchValue({
        display: this.displaying,
        displaydes: this.getDescrip(name, type) ?? null
      });
    }
    if (type === HashesSelectKind.FILTER) {
      this.filtering = name;
      this.viewForm.patchValue({
        filter: this.filtering,
        filterdes: this.getDescrip(name, type) ?? null
      });
    }
  }

  // Get the description for filter and display options
  getDescrip(item: string, type: HashesSelectKind): string | undefined {
    const selectedArray = type === HashesSelectKind.DISPLAY ? this.selectDisplays : this.selectFilters;
    const selectedItem = selectedArray?.find((obj) => obj?._id === item);

    if (selectedItem) {
      if (type === HashesSelectKind.DISPLAY) {
        this.displayingDescr = selectedItem.name;
      } else if (type === HashesSelectKind.FILTER) {
        this.filteringDescr = selectedItem.name;
      }

      return selectedItem.name;
    }

    return undefined;
  }
}
