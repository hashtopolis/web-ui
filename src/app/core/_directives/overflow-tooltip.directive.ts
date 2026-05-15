import { AfterViewInit, Directive, ElementRef, Input, NgZone, OnDestroy, inject } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';

@Directive({
  selector: '[appOverflowTooltip]',
  standalone: true
})
export class OverflowTooltipDirective implements AfterViewInit, OnDestroy {
  /* Optional CSS selector for a descendant whose `scrollWidth`/`clientWidth` drives
     the tooltip's disabled state. Useful when the hover target (e.g. <mat-checkbox>)
     and the actually-truncating text (a child span) live on different elements. */
  @Input('appOverflowTooltip') target = '';

  private readonly host: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly tooltip = inject(MatTooltip);
  private readonly zone = inject(NgZone);
  private observer?: ResizeObserver;

  ngAfterViewInit(): void {
    const el = this.measuredElement();
    if (!el) return;
    this.zone.runOutsideAngular(() => {
      this.observer = new ResizeObserver(() => this.update(el));
      this.observer.observe(el);
    });
    this.update(el);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private measuredElement(): HTMLElement | null {
    if (!this.target) return this.host.nativeElement;
    return this.host.nativeElement.querySelector<HTMLElement>(this.target);
  }

  private update(el: HTMLElement): void {
    this.tooltip.disabled = el.scrollWidth <= el.clientWidth;
  }
}
