import { HorizontalNav } from 'src/app/core/_models/horizontalnav.model';
import { Component, Input, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'horizontalnav',
  template: `
    <mat-toolbar>
      <div class="d-flex w-100">
        <div class="d-block mb-4 mb-md-0">
          <div #content><ng-content></ng-content></div>
        </div>
        <ng-container *ngIf="menuItems.length > 0; else noItems">
          <div class="btn-toolbar mb-2 mb-md-0">
            <div class="btn-group ms-2 ms-3">
              <mat-button-toggle-group
                appearance="legacy"
                name="fontStyle"
                aria-label="Font Style"
              >
                <ng-container *ngFor="let item of menuItems">
                  <mat-button-toggle
                    [ngClass]="getButtonClass(item.routeName)"
                    (click)="navigateTo(item.routeName)"
                    (keydown)="handleKeyDown($event, item.routeName)"
                    tabindex="0"
                    style="cursor: pointer;"
                  >
                    {{ item.label }}
                  </mat-button-toggle>
                </ng-container>
              </mat-button-toggle-group>
            </div>
          </div>
        </ng-container>
      </div>
      <ng-template #noItems>
        <!-- Handle case when menuItems is empty -->
      </ng-template>
    </mat-toolbar>
  `
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
