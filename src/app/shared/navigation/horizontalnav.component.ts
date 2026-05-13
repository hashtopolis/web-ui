import { HorizontalNav } from 'src/app/core/_models/horizontalnav.model';
import { Component, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
    selector: 'horizontalnav',
    templateUrl: 'horizontalnav.component.html',
    standalone: false
})
export class HorizontalNavComponent implements OnDestroy {
  @Input() menuItems: HorizontalNav[] = [];
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private router: Router) {}

  /**
   * Whether a route is currently active (used to drive [checked] on the
   * matching <mat-button-toggle>, which Material then styles via its
   * --mat-button-toggle-* selection tokens).
   */
  isActive(routeName: string): boolean {
    return this.router.url.includes(routeName);
  }

  /**
   * Navigates to a specified route when a button is clicked.
   * @param routeName The name of the route to navigate to.
   */
  navigateTo(routeName: string): void {
    this.router.navigate([`${routeName}`]);
  }

  /**
   * Handles keydown events to trigger navigation when Enter or Spacebar is pressed.
   * @param event The keyboard event.
   * @param routeName The name of the route to navigate to.
   */
  handleKeyDown(event: KeyboardEvent, routeName: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
      this.navigateTo(routeName);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
