import { Directive, ElementRef, HostListener, Input, OnChanges, OnInit, Renderer2, SimpleChanges } from '@angular/core';

/**
 * Directive to make any button unresponsive during loading
 *
 * Usage:
 * <button appLoadingButton [loading]="isLoading">Submit</button>
 * <button-submit appLoadingButton [loading]="isLoading" name="Create"></button-submit>
 */
@Directive({
  selector: '[appLoadingButton]',
  standalone: false
})
export class LoadingButtonDirective implements OnInit, OnChanges {
  @Input() loading = false;

  private originalDisabledState: boolean | null = null;
  private targetButton: HTMLElement | null = null;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    // Find the actual button element - it could be the host element or a child
    this.targetButton = this.findButtonElement(this.elementRef.nativeElement);

    if (!this.targetButton) {
      console.error('LoadingButtonDirective: No button element found');
      return;
    }

    // Apply initial state
    this.updateButtonState();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['loading']) {
      this.updateButtonState();
    }
  }

  /**
   * Find the button element (either the host or a child button)
   */
  private findButtonElement(element: HTMLElement): HTMLElement {
    // If the element is a button, return it
    if (element.tagName === 'BUTTON') {
      return element;
    }

    // Check if element is button-submit and find the mat-raised-button inside
    if (element.tagName.toLowerCase() === 'button-submit') {
      const button = element.querySelector('button');
      if (button) {
        return button;
      }
    }

    // For other elements, find the first button child
    const button = element.querySelector('button');
    return button || element; // Fallback to original element if no button found
  }

  private updateButtonState(): void {
    if (!this.targetButton) {
      return;
    }

    if (this.loading) {
      // Store original disabled state if not already stored
      if (this.originalDisabledState === null) {
        this.originalDisabledState = this.targetButton.hasAttribute('disabled');
      }

      // Disable the button
      this.renderer.setAttribute(this.targetButton, 'disabled', 'true');
    } else {
      // Restore original disabled state
      if (this.originalDisabledState === false) {
        this.renderer.removeAttribute(this.targetButton, 'disabled');
      }
    }
  }

  // Prevent click when loading
  @HostListener('click', ['$event'])
  onClick(event: Event): void {
    if (this.loading) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
