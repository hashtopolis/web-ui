import { AfterViewInit, Directive, ElementRef, NgZone, OnDestroy, inject } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';

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
    this.tooltip.disabled = el.scrollWidth <= el.clientWidth;
  }
}
