import { zChunkResponse, zHashlistResponse, zTaskResponse } from '@generated/api/zod';

import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Params } from '@angular/router';

import { JChunk } from '@models/chunk.model';
import { JHashlist } from '@models/hashlist.model';
import { ResponseWrapper } from '@models/response.model';
import { HashesRouteKind, zHashesRouteData, zHashesRouteParams, zRouteId } from '@models/routes.schema';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { AutoTitleService } from '@services/shared/autotitle.service';

import { HashesViewType } from '@src/app/core/_constants/hashes.config';

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

  // Component Properties
  editMode = false;
  editedIndex: number;

  // View type and filter options
  whichView: HashesViewType;
  protected readonly HashesViewType = HashesViewType;
  titleName: string;
  filterParam: string;

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
    });
  }
}
