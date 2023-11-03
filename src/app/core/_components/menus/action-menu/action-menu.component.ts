/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-selector */
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActionMenuEvent, ActionMenuItem } from './action-menu.model';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

/**
 * Component representing an action menu with a list of menu items.
 * 
 * Each action menu item can have either an `action` or a `routerLink`. If
 * the menu item `action` attribute is set an event is emitted with the 
 * menu item itself and the `data` privided when clicked. If the `routerLink` 
 * attribute is set the user will be routed on click. 
 * 
 * The actionMenuItems are divided into sections by providing them in separate 
 * arrays like this: `[[A, B, C], [D, E, F]]`. This will generate two sections
 * separetad by a divider.
 *
 * @example
 * <action-menu
 *   icon="menu"
 *   label="Actions"
 *   cls="custom-class"
 *   [data]="customData"
 *   [actionMenuItems]="menuItems"
 *   (menuItemClicked)="onMenuItemClicked($event)"
 * ></action-menu>
 */
@Component({
  selector: 'action-menu',
  templateUrl: './action-menu.component.html'
})
export class ActionMenuComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = []

  currentUrl: any[];
  isActive = false

  /** Icon to be displayed in the menu button. */
  @Input() icon: string;
  /** Label for the menu button. */
  @Input() label: string;
  /** Determines if the menu button is disabled. */
  @Input() disabled = false;
  /** Custom CSS classes for styling. */
  @Input() cls = ''
  /** Custom data to be associated with the menu. */
  @Input() data: any;
  /** Two-dimensional array of sections / menu items. */
  @Input() actionMenuItems: ActionMenuItem[][] = []

  @Output() menuItemClicked: EventEmitter<ActionMenuEvent<any>> = new EventEmitter<ActionMenuEvent<any>>();

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.subscriptions.push(this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url.split('/').slice(1)
        this.checkIsActive()
      }
    }))
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe()
    }
  }

  /**
   * Checks if a menu item should be marked as active based on the current URL.
   */
  checkIsActive(): void {
    this.isActive = false
    for (const section of this.actionMenuItems) {
      if (this.isActive) {
        break;
      }
      for (const item of section) {
        if (item.routerLink && item.routerLink.length === this.currentUrl.length &&
          item.routerLink.every((value, index) => value === this.currentUrl[index])) {
          this.isActive = true
          break;
        }
      }
    }
  }

  /**
   * Handle the click event when a menu item is selected.
   * @param menuItem - The selected menu item.
   */
  onMenuItemClick(menuItem: ActionMenuItem): void {
    if (menuItem.routerLink) {
      this.router.navigate(menuItem.routerLink)
    } else {
      this.menuItemClicked.emit({
        menuItem: menuItem,
        data: this.data
      });
    }
  }
}