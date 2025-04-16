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
   * Returns the CSS class for a button element based on the current route.
   * @param routeName The name of the route associated with the button.
   * @returns The CSS class, including 'select' if the button's route is active.
   */
  getButtonClass(routeName: string): string {
    return this.router.url.includes(routeName) ? 'btn-toogle-select' : '';
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
