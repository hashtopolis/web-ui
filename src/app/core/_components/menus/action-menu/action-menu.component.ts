import { ActionMenuEvent, ActionMenuItem } from './action-menu.model';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { faPaperPlane, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faDiscord, faGithub } from '@fortawesome/free-brands-svg-icons';
import { LocalStorageService } from 'src/app/core/_services/storage/local-storage.service';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-selector */
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';

import { MatMenuTrigger } from '@angular/material/menu';
import { Subscription } from 'rxjs';
import { UISettingsUtilityClass } from '../../../../shared/utils/config';
import { UIConfig } from '../../../_models/config-ui.model';

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
  private subscriptions: Subscription[] = [];

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

  @Output() menuItemClicked: EventEmitter<ActionMenuEvent<any>> =
    new EventEmitter<ActionMenuEvent<any>>();

  timedOutCloser: NodeJS.Timeout;
  timedOutOpener: NodeJS.Timeout;

  openSubmenus: MatMenuTrigger[] = [];

  faDiscord = faDiscord;
  faGithub = faGithub;
  faPaperplane = faPaperPlane;
  faGlobe = faGlobe;

  isDarkMode = false;
  faIconColor = "white";

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private storage: LocalStorageService<UIConfig>
  ) {
    this.uiSettings = new UISettingsUtilityClass(this.storage);
    this.isDarkMode = this.uiSettings.getSetting('theme') === 'dark';
    if (this.isDarkMode) {
      this.faIconColor = "white";
    } else {
      this.faIconColor = "black";
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
          if (
            item.routerLink &&
            partial.every((value, index) => value === item.routerLink[index])
          ) {
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

  /**
   * Handle mouse enter event for the menu.
   * @param trigger - The MatMenuTrigger associated with the menu.
   */
  menuEnter(trigger: MatMenuTrigger): void {
    if (this.timedOutCloser) {
      clearTimeout(this.timedOutCloser);
    }

    if (!trigger.menuOpen) {
      this.timedOutOpener = setTimeout(() => {
        this.openSubmenus.push(trigger);
        trigger.openMenu();
      }, 50);
    }
  }

  /**
   * Handle mouse leave event for the menu.
   * @param trigger - The MatMenuTrigger associated with the menu.
   */
  menuLeave(trigger: MatMenuTrigger): void {
    if (this.timedOutOpener) {
      clearTimeout(this.timedOutOpener);
    }

    if (trigger.menuOpen) {
      this.timedOutCloser = setTimeout(() => {
        this.closeAllSubmenus();
      }, 100);
    }
  }

  /**
   * Handle mouse enter event for a submenu.
   */
  subMenuEnter(trigger: MatMenuTrigger): void {
    if (this.timedOutCloser) {
      clearTimeout(this.timedOutCloser);
    }

    this.timedOutOpener = setTimeout(() => {
      this.openSubmenus.push(trigger);
      trigger.openMenu();
    }, 50);
  }

  /**
   * Handle mouse leave event for a submenu.
   */
  subMenuLeave(): void {
    if (this.timedOutOpener) {
      clearTimeout(this.timedOutOpener);
    }

    this.timedOutCloser = setTimeout(() => {
      this.closeAllSubmenus();
    }, 100);
  }

  /**
   * Check if the related target is inside the menu panel.
   * @param event - The mouse event.
   * @param trigger - The MatMenuTrigger associated with the menu.
   * @returns True if the related target is inside the menu panel, false otherwise.
   */
  isRelatedTargetInPanel(event: MouseEvent, trigger: MatMenuTrigger): boolean {
    const panelId = trigger.menu?.panelId;

    if (panelId && event.relatedTarget instanceof Element) {
      const relatedTargetInPanel = event.relatedTarget.closest(`#${panelId}`);
      const isAnotherMenuContent = event.relatedTarget.classList.contains(
        'mat-mdc-menu-content'
      );

      return relatedTargetInPanel && !isAnotherMenuContent;
    }

    return false;
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
   * Close all open submenus.
   */
  closeAllSubmenus(): void {
    this.openSubmenus.forEach((trigger) => trigger.closeMenu());
    this.openSubmenus = [];
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
