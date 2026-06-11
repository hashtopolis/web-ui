import { AfterViewInit, Directive, ElementRef, NgZone, OnDestroy, inject } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';

/**
 * Shows the host's own text as a Material tooltip, but only while that text is
 * clipped (ellipsized). Pair it with `matTooltip` on an element whose CSS clips
 * overflow (`white-space: nowrap; overflow: hidden; text-overflow: ellipsis`):
 *
 * ```html
 * <span class="ht-cell-label" matTooltip appOverflowTooltip>{{ label }}</span>
 * ```
 *
 * The tooltip message defaults to the element's `textContent`, so it works for
 * plain text and `[innerHtml]` cells alike without binding the value twice.
 * A `ResizeObserver` re-checks on width changes (column resize, zoom).
 */
@Directive({
  selector: '[appOverflowTooltip]',
  standalone: true
})
export class OverflowTooltipDirective implements AfterViewInit, OnDestroy {
  private readonly host: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly tooltip = inject(MatTooltip);
  private readonly zone = inject(NgZone);
  private observer?: ResizeObserver;

  ngAfterViewInit(): void {
    const el = this.host.nativeElement;
    this.zone.runOutsideAngular(() => {
      this.observer = new ResizeObserver(() => this.update(el));
      this.observer.observe(el);
    });
    this.update(el);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private update(el: HTMLElement): void {
    const overflowing = el.scrollWidth > el.clientWidth;
    if (overflowing) {
      this.tooltip.message = (el.textContent ?? '').trim();
    }
    this.tooltip.disabled = !overflowing;
  }
}
