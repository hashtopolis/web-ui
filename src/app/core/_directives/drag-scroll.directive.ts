import { Directive, ElementRef, HostListener, Input, OnDestroy, OnInit, inject } from '@angular/core';

/**
 * Click-and-drag horizontal scrolling for any overflowing scroll container.
 *
 * A press that doesn't move past {@link appDragScrollThreshold} stays a normal click, so links,
 * buttons and inline edit inside the element keep working; only a real drag is turned into a
 * scroll (and its trailing click is swallowed). Presses inside a text field are ignored so native
 * text selection still works.
 *
 * Usage: `<div class="my-scroll" appDragScroll>…</div>`. The host gets the
 * `app-drag-scroll-dragging` class while a drag is in progress (used for the grabbing cursor).
 */
@Directive({
  selector: '[appDragScroll]',
  standalone: true
})
export class DragScrollDirective implements OnInit, OnDestroy {
  /** Pixels of movement before a press becomes a drag rather than a click. */
  @Input() appDragScrollThreshold = 5;

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  private startX = 0;
  private startScrollLeft = 0;
  private pressed = false;
  private moved = false;
  /** Set after a drag so the trailing click is swallowed; reset on the next press. */
  private suppressClick = false;

  ngOnInit(): void {
    // Capture-phase so the post-drag click is swallowed before it reaches links / cells.
    this.el.addEventListener('click', this.onClickCapture, true);
  }

  ngOnDestroy(): void {
    this.el.removeEventListener('click', this.onClickCapture, true);
    window.removeEventListener('mousemove', this.onPointerMove);
    window.removeEventListener('mouseup', this.onPointerUp);
  }

  @HostListener('mousedown', ['$event'])
  onPointerDown(event: MouseEvent): void {
    this.suppressClick = false;
    if (event.button !== 0 || this.el.scrollWidth - this.el.clientWidth <= 1) {
      return;
    }
    if ((event.target as HTMLElement).closest('input, textarea, select, [contenteditable="true"]')) {
      return;
    }
    this.startX = event.pageX;
    this.startScrollLeft = this.el.scrollLeft;
    this.pressed = true;
    this.moved = false;
    window.addEventListener('mousemove', this.onPointerMove);
    window.addEventListener('mouseup', this.onPointerUp);
  }

  /** Prevents the browser's native link/text drag from hijacking a scroll drag. */
  @HostListener('dragstart', ['$event'])
  onDragStart(event: Event): void {
    if (this.pressed) {
      event.preventDefault();
    }
  }

  private onPointerMove = (event: MouseEvent): void => {
    if (!this.pressed) {
      return;
    }
    const dx = event.pageX - this.startX;
    if (!this.moved) {
      if (Math.abs(dx) < this.appDragScrollThreshold) {
        return;
      }
      this.moved = true;
      this.suppressClick = true;
      // Direct DOM toggle (not a host binding): the consumer's view may be OnPush, so a
      // window-listener change wouldn't be picked up by change detection.
      this.el.classList.add('app-drag-scroll-dragging');
    }
    event.preventDefault();
    // Drop any text the press selected before/while it crossed the drag threshold; the
    // `user-select: none` from the dragging class then stops further selection.
    window.getSelection()?.removeAllRanges();
    this.el.scrollLeft = this.startScrollLeft - dx;
  };

  private onPointerUp = (): void => {
    window.removeEventListener('mousemove', this.onPointerMove);
    window.removeEventListener('mouseup', this.onPointerUp);
    this.pressed = false;
    this.el.classList.remove('app-drag-scroll-dragging');
    // suppressClick stays set so onClickCapture swallows the click this drag triggers; it is
    // reset on the next press so a later genuine click is never lost.
  };

  private onClickCapture = (event: MouseEvent): void => {
    if (!this.suppressClick) {
      return;
    }
    this.suppressClick = false;
    event.stopPropagation();
    event.preventDefault();
  };
}
