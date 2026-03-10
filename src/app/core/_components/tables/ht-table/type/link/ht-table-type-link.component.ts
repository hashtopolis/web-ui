import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  inject
} from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';

import { BaseModel } from '@models/base.model';

import { HTTableColumn, HTTableRouterLink } from '@components/tables/ht-table/ht-table.models';

@Component({
  selector: 'app-ht-table-link',
  templateUrl: './ht-table-type-link.component.html',
  styleUrl: './ht-table-type-link.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class HTTableTypeLinkComponent implements OnDestroy {
  @Input() element: BaseModel;
  @Input() tableColumn: HTTableColumn;

  @Output() linkClicked = new EventEmitter();

  private previewImageCache = new Map<number, SafeUrl>();
  private pendingPreviewLoads = new Set<number>();
  private previewLoadErrors = new Set<number>();
  private objectUrls: string[] = [];
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  onLinkClicked() {
    this.linkClicked.emit();
  }

  ngOnDestroy(): void {
    for (const objectUrl of this.objectUrls) {
      URL.revokeObjectURL(objectUrl);
    }
    this.objectUrls = [];
  }

  prefetchVisualGraph(link: HTTableRouterLink): void {
    const graph = link.visualGraph;
    if (!graph?.enabled || !graph.taskId || !graph.imageUrl) {
      return;
    }

    if (this.previewImageCache.has(graph.taskId) || this.pendingPreviewLoads.has(graph.taskId)) {
      return;
    }

    this.pendingPreviewLoads.add(graph.taskId);
    this.previewLoadErrors.delete(graph.taskId);

    this.http.get(graph.imageUrl, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        this.pendingPreviewLoads.delete(graph.taskId);
        const isImageBlob = !!blob?.type && blob.type.startsWith('image/');
        // Guard against HTML/JSON responses returned as blobs (auth errors, backend errors).
        if (!blob || blob.size === 0 || !isImageBlob) {
          this.previewLoadErrors.add(graph.taskId);
          this.cdr.markForCheck();
          return;
        }

        const objectUrl = URL.createObjectURL(blob);
        this.objectUrls.push(objectUrl);
        this.previewImageCache.set(graph.taskId, objectUrl);
        this.cdr.markForCheck();
      },
      error: () => {
        this.pendingPreviewLoads.delete(graph.taskId);
        this.previewLoadErrors.add(graph.taskId);
        this.cdr.markForCheck();
      }
    });
  }

  getVisualGraphPreview(link: HTTableRouterLink): SafeUrl | null {
    const taskId = link.visualGraph?.taskId;
    if (!taskId) {
      return null;
    }
    return this.previewImageCache.get(taskId) ?? null;
  }

  hasVisualGraphLoadError(link: HTTableRouterLink): boolean {
    const taskId = link.visualGraph?.taskId;
    return !!taskId && this.previewLoadErrors.has(taskId);
  }

  onVisualGraphImageError(link: HTTableRouterLink): void {
    const taskId = link.visualGraph?.taskId;
    if (!taskId) {
      return;
    }

    this.previewLoadErrors.add(taskId);
    this.previewImageCache.delete(taskId);
    this.cdr.markForCheck();
  }

  /**
   * TrackBy function for HTTableRouterLink items in an ngFor loop.
   *
   * This function helps Angular identify each item uniquely to optimize DOM updates
   * by avoiding re-rendering of unchanged items.
   *
   * Since HTTableRouterLink does not have a unique `id`, this function uses the
   * joined `routerLink` array as a unique key. If `routerLink` is empty, it falls back
   * to the `label`. If neither is available, it returns the index as a last resort.
   *
   * @param index - The index of the item in the iterable.
   * @param item - The HTTableRouterLink item.
   * @returns A unique identifier for the item (string, number, or index).
   */
  trackByFn(index: number, item: HTTableRouterLink): string | number {
    if (item.routerLink && item.routerLink.length) {
      return item.routerLink.join('-');
    }
    if (item.label) {
      return item.label;
    }
    return index;
  }
}
