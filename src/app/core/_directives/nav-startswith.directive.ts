import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

/**
 * Directive to add a custom class to an element if the current route starts with a specified path,
 * excluding routes containing a specified string.
 *
 * Usage:
 *   Add the [startsWithActive] attribute to an HTML element and provide the path as its value.
 *   You can also provide an optional string to exclude routes containing that string, and a custom class.
 *
 * Example:
 *   <a [routerLink]="['/agents/show-agents']" [startsWithActive]="'/agents'" [excludeContaining]="'engine'" [customClass]="'custom-active'">
 *     Show Agents
 *   </a>
 *
 * When the current route starts with the specified path and does not contain the exclusion string,
 * the custom class is added to the element.
 */
@Directive({
  selector: '[startsWithActive]'
})
export class StartsWithActiveDirective implements OnInit {
  @Input() startsWithActive: string;
  @Input() excludeContaining?: string;
  @Input() customClass?: string;

  constructor(private el: ElementRef, private renderer: Renderer2, private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentRoute = this.router.url;
        if (
          currentRoute.startsWith(this.startsWithActive) &&
          (!this.excludeContaining || !currentRoute.includes(this.excludeContaining))
        ) {
          if (this.customClass) {
            this.renderer.addClass(this.el.nativeElement, this.customClass);
          } else {
            this.el.nativeElement.classList.add('active');
          }
        } else {
          if (this.customClass) {
            this.renderer.removeClass(this.el.nativeElement, this.customClass);
          } else {
            this.el.nativeElement.classList.remove('active');
          }
        }
      }
    });
  }
}
