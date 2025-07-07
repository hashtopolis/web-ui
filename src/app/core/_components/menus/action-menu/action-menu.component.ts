/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-selector */
import { faDiscord, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faGlobe, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { LocalStorageService } from 'src/app/core/_services/storage/local-storage.service';

import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { NavigationEnd, Router } from '@angular/router';

import { UIConfig } from '@models/config-ui.model';

import { ActionMenuEvent, ActionMenuItem } from '@components/menus/action-menu/action-menu.model';

import { UISettingsUtilityClass } from '@src/app/shared/utils/config';

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
  templateUrl: './action-menu.component.html',
  standalone: false
})
export class ActionMenuComponent implements OnInit, AfterViewInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  hovering = false;
  hoverTimeout: ReturnType<typeof setTimeout>;
  menuPanelId: string | undefined;

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @ViewChild('menuTriggerButton', { read: ElementRef }) triggerButton!: ElementRef<HTMLButtonElement>;

  currentUrl: any[];
  isActive = false;

  protected uiSettings: UISettingsUtilityClass;

  /** Icon to be displayed in the menu button. */
  @Input() icon: string;
  /** Label for the menu button. */
  @Input() label: string;
  /** Determines if the menu button is disabled. */
  @Input() disabled = false;
  /** Custom CSS classes for styling. */
  @Input() cls = '';
  /** Custom data to be associated with the menu. */
  @Input() data: any;
  /** Two-dimensional array of sections / menu items. */
  @Input() actionMenuItems: ActionMenuItem[][] = [];

  @Input() openOnMouseEnter = false;

  @Output() menuItemClicked: EventEmitter<ActionMenuEvent<any>> = new EventEmitter<ActionMenuEvent<any>>();

  openSubmenus: MatMenuTrigger[] = [];

  faDiscord = faDiscord;
  faGithub = faGithub;
  faPaperplane = faPaperPlane;
  faGlobe = faGlobe;
  faBook = faBook;

  isDarkMode = false;
  faIconColor = 'white';

  private static openMenuTrigger: MatMenuTrigger | null = null;

  constructor(
    private router: Router,
    private storage: LocalStorageService<UIConfig>
  ) {
    this.uiSettings = new UISettingsUtilityClass(this.storage);
    this.isDarkMode = this.uiSettings.getSetting('theme') === 'dark';
    if (this.isDarkMode) {
      this.faIconColor = 'white';
    } else {
      this.faIconColor = 'black';
    }
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.router.events.subscribe((event: any) => {
        if (event instanceof NavigationEnd) {
          this.currentUrl = event.url.split('/').slice(1);
          this.checkIsActive();
        }
      })
    );
  }

  /**
   * After view init, gets the menu panel ID for hover checks and subscribes to the
   * `menuClosed` event. The subscription cleans up the static `openMenuTrigger`
   * reference to ensure only one menu can be open at a time.
   */
  ngAfterViewInit(): void {
    this.menuPanelId = this.trigger.menu?.panelId;

    // Add this subscription to handle cleanup
    this.subscriptions.push(
      this.trigger.menuClosed.subscribe(() => {
        // When this menu closes, check if it was the one being tracked.
        // If so, clear the static reference.
        if (ActionMenuComponent.openMenuTrigger === this.trigger) {
          ActionMenuComponent.openMenuTrigger = null;
        }
      })
    );
  }

  /**
   *  Display fontawesome icons according to the icon name
   **/
  iconContainsDiscord(name: string): boolean {
    if (name != undefined) {
      return name.toLowerCase() === 'fadiscord';
    } else {
      return false;
    }
  }

  iconContainsGithub(name: string): boolean {
    if (name != undefined) {
      return name.toLowerCase() === 'fagithub';
    } else {
      return false;
    }
  }

  iconContainsPaperplane(name: string): boolean {
    if (name != undefined) {
      return name.toLowerCase() === 'fapaperplane';
    } else {
      return false;
    }
  }

  iconContainsGlobe(name: string): boolean {
    if (name != undefined) {
      return name.toLowerCase() === 'faglobe';
    } else {
      return false;
    }
  }

  iconContainsBook(name: string): boolean {
    if (name != undefined) {
      return name.toLowerCase() === 'fabook';
    } else {
      return false;
    }
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  /**
   * Checks if a menu item should be considered active based on the current URL.
   * It sets the 'isActive' property to true if the menu item's 'routerLink' matches
   * or partially matches the beginning of the current URL.
   *
   * The 'actionMenuItems' array should contain sections of menu items, where each
   * section is an array of menu items with 'routerLink' properties.
   *
   */
  checkIsActive(): void {
    this.isActive = false;
    for (const section of this.actionMenuItems) {
      if (this.isActive) {
        break;
      }
      for (const item of section) {
        if (item.routerLink) {
          const partial = this.currentUrl.slice(0, item.routerLink.length);
          if (item.routerLink && partial.every((value, index) => value === item.routerLink[index])) {
            this.isActive = true;
            break;
          }
        }
      }
    }
  }

  /**
   * Handle the click event when a menu item is selected.
   * @param menuItem - The selected menu item.
   */
  onMenuItemClick(menuItem: ActionMenuItem): void {
    if (menuItem.routerLink && !menuItem.external) {
      this.router.navigate(menuItem.routerLink);
    } else if (menuItem.routerLink && menuItem.external) {
      // Open external link in a new tab
      window.open(String(menuItem.routerLink), '_blank');
    } else {
      this.menuItemClicked.emit({
        menuItem: menuItem,
        data: this.data
      });
    }
  }

  onMouseEnter(): void {
    // If a different menu is open, close it.
    if (ActionMenuComponent.openMenuTrigger && ActionMenuComponent.openMenuTrigger !== this.trigger) {
      ActionMenuComponent.openMenuTrigger.closeMenu();
    }

    this.hovering = true;
    clearTimeout(this.hoverTimeout);
    if (!this.trigger.menuOpen) {
      this.trigger.openMenu();
      // Set the current trigger as the globally open one.
      ActionMenuComponent.openMenuTrigger = this.trigger;
    }
  }

  onMouseLeave(event: MouseEvent): void {
    this.hoverTimeout = setTimeout(() => {
      this.checkMouseOutside(event);
    }, 150);
  }

  checkMouseOutside(event: MouseEvent): void {
    const x = event.clientX;
    const y = event.clientY;

    const hoveredElement = document.elementFromPoint(x, y);

    // Check if element is inside trigger or menu
    const insideTrigger = this.triggerButton.nativeElement.contains(hoveredElement);
    const insideMenu = hoveredElement?.closest(`#${this.menuPanelId ?? ''}`);

    if (!insideTrigger && !insideMenu) {
      this.trigger.closeMenu();
      this.hovering = false;
    }
  }

  /**
   * Prevent focus on the button.
   * @param event - The focus event.
   */
  preventFocus(event: FocusEvent): void {
    // Prevent the focus and blur the button immediately
    event.preventDefault();
    (event.target as HTMLElement).blur();
  }

  /**
   * Navigate to the first menu item.
   * @param event - The mouse event.
   */
  navigateToFirst(event: MouseEvent): void {
    event.stopPropagation();
    if (this.actionMenuItems[0][0].external) {
      window.open(String(this.actionMenuItems[0][0].routerLink), '_blank');
    } else if (this.actionMenuItems[0][0].routerLink) {
      this.router.navigate(this.actionMenuItems[0][0].routerLink);
    }
  }
}
