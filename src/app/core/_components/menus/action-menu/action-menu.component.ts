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
  Renderer2,
  ViewChild
} from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { NavigationEnd, Router } from '@angular/router';

import { UIConfig } from '@models/config-ui.model';

import { ActionMenuEvent, ActionMenuItem } from '@components/menus/action-menu/action-menu.model';

import { UISettingsUtilityClass } from '@src/app/shared/utils/config';

@Component({
  selector: 'action-menu',
  templateUrl: './action-menu.component.html',
  standalone: false
})
export class ActionMenuComponent implements OnInit, AfterViewInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  private globalMouseMoveListener: (() => void) | null = null;

  hovering = false;
  hoverTimeout: ReturnType<typeof setTimeout>;
  menuPanelId: string | undefined;

  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;
  @ViewChild('menuTriggerButton', { read: ElementRef }) triggerButton!: ElementRef<HTMLButtonElement>;

  currentUrl: string[] = [];
  isActive = false;

  protected uiSettings: UISettingsUtilityClass;

  @Input() icon: string = '';
  @Input() label: string = '';
  @Input() disabled = false;
  @Input() cls = '';
  @Input() data: unknown;
  @Input() actionMenuItems: ActionMenuItem[][] = [];

  @Input() openOnMouseEnter = false;

  /**
   * If true, enable hover-close behavior. Useful for cases
   * where the menu should close when leaving mouse outside.
   */
  @Input() enableHoverClose = false;

  @Output() menuItemClicked: EventEmitter<ActionMenuEvent<unknown>> = new EventEmitter<ActionMenuEvent<unknown>>();

  openSubmenus: MatMenuTrigger[] = [];

  faDiscord = faDiscord;
  faGithub = faGithub;
  faPaperplane = faPaperPlane;
  faGlobe = faGlobe;
  faBook = faBook;

  isDarkMode = false;
  faIconColor = 'white';

  hoveringButton = false;
  hoveringMenu = false;

  private static openMenuTrigger: MatMenuTrigger | null = null;

  constructor(
    private router: Router,
    private storage: LocalStorageService<UIConfig>,
    private renderer: Renderer2
  ) {
    this.uiSettings = new UISettingsUtilityClass(this.storage);
    this.isDarkMode = this.uiSettings.getSetting('theme') === 'dark';
    this.faIconColor = this.isDarkMode ? 'white' : 'black';
  }

  /**
   * Angular lifecycle hook: Initializes component.
   * Subscribes to router events to close menu on navigation and update active state.
   */
  ngOnInit(): void {
    this.subscriptions.push(
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.currentUrl = event.url.split('/').slice(1);
          this.checkIsActive();

          // Close menu on navigation end
          if (this.trigger?.menuOpen) {
            this.trigger.closeMenu();
          }
        }
      })
    );
  }

  /**
   * Angular lifecycle hook: Called after view initialization.
   * Sets menuPanelId, subscribes to menu open/close events to manage global mouse listener.
   */
  ngAfterViewInit(): void {
    this.menuPanelId = this.trigger.menu?.panelId;

    this.subscriptions.push(
      this.trigger.menuClosed.subscribe(() => {
        if (ActionMenuComponent.openMenuTrigger === this.trigger) {
          ActionMenuComponent.openMenuTrigger = null;
        }
        this.removeGlobalMouseListener();
      })
    );

    this.subscriptions.push(
      this.trigger.menuOpened.subscribe(() => {
        // Slight delay to ensure the menu DOM is initialized before checking pointer
        setTimeout(() => {
          this.addGlobalMouseListener();
        }, 50); // even 10–30ms might work; tune as needed
      })
    );
  }

  /**
   * Adds a global mousemove event listener on the document.
   * Used to detect when the mouse pointer moves outside the button and menu to close it.
   * Prevents multiple listeners by checking if one already exists.
   */
  addGlobalMouseListener() {
    if (this.globalMouseMoveListener) return; // already listening

    this.globalMouseMoveListener = this.renderer.listen('document', 'mousemove', (event: MouseEvent) => {
      this.checkPointerOutside(event);
    });
  }

  /**
   * Removes the global mousemove event listener if it exists.
   * Called when the menu closes to clean up resources.
   */
  removeGlobalMouseListener() {
    if (this.globalMouseMoveListener) {
      this.globalMouseMoveListener();
      this.globalMouseMoveListener = null;
    }
  }

  /**
   * Angular lifecycle hook: Cleans up subscriptions and removes global mouse listener.
   */
  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
    this.removeGlobalMouseListener();
  }

  /**
   * Checks if the current URL matches any of the routerLinks in the menu items.
   * Sets the isActive flag to highlight the active menu state.
   */
  checkIsActive(): void {
    this.isActive = false;
    for (const section of this.actionMenuItems) {
      if (this.isActive) break;
      for (const item of section) {
        if (item.routerLink) {
          const partial = this.currentUrl.slice(0, item.routerLink.length);
          if (partial.every((value, index) => value === item.routerLink[index])) {
            this.isActive = true;
            break;
          }
        }
      }
    }
  }

  /**
   * Handles a click on a menu item.
   * Navigates internally or externally based on menuItem properties,
   * or emits an event for custom handling.
   * Closes the menu afterward.
   * @param menuItem The clicked ActionMenuItem
   */
  onMenuItemClick(menuItem: ActionMenuItem): void {
    if (menuItem.routerLink && !menuItem.external) {
      this.router.navigate(menuItem.routerLink).then(() => {
        this.closeMenuIfOpen();
      });
    } else if (menuItem.routerLink && menuItem.external) {
      window.open(String(menuItem.routerLink), '_blank');
      this.closeMenuIfOpen();
    } else {
      this.menuItemClicked.emit({
        menuItem,
        data: this.data
      });
      this.closeMenuIfOpen();
    }
  }

  /**
   * Closes the menu if it is currently open.
   */
  closeMenuIfOpen(): void {
    if (this.trigger?.menuOpen) {
      this.trigger.closeMenu();
    }
  }

  /**
   * Handles mouse entering the menu trigger button.
   * Opens the menu if not already open and closes any other open menus.
   */
  onMouseEnter(): void {
    this.hoveringButton = true;
    this.clearHoverTimeout();

    if (ActionMenuComponent.openMenuTrigger && ActionMenuComponent.openMenuTrigger !== this.trigger) {
      ActionMenuComponent.openMenuTrigger.closeMenu();
    }

    if (!this.trigger.menuOpen) {
      this.trigger.openMenu();
      ActionMenuComponent.openMenuTrigger = this.trigger;
    }
  }

  /**
   * Handles mouse leaving the menu trigger button.
   * Starts a timeout to possibly close the menu if pointer leaves both button and menu.
   * @param event MouseEvent triggered on mouse leave
   */
  onMouseLeave(event: MouseEvent): void {
    this.hoveringButton = false;
    this.startHoverTimeout(event);
  }

  /**
   * Handles mouse entering the menu panel.
   * Cancels any pending close timeout.
   */
  onMenuMouseEnter(): void {
    this.hoveringMenu = true;
    this.clearHoverTimeout();
  }

  /**
   * Handles mouse leaving the menu panel.
   * Starts a timeout to possibly close the menu if pointer leaves both button and menu.
   * @param event MouseEvent triggered on mouse leave
   */
  onMenuMouseLeave(event: MouseEvent): void {
    this.hoveringMenu = false;
    this.startHoverTimeout(event);
  }

  /**
   * Starts a short timeout (150ms) to check if the mouse pointer
   * is outside both the trigger button and menu panel before closing the menu.
   * @param event MouseEvent used to check pointer position
   */
  startHoverTimeout(event: MouseEvent) {
    if (!this.openOnMouseEnter || !this.enableHoverClose) return;
    this.hoverTimeout = setTimeout(() => {
      this.checkPointerOutside(event);
    }, 150);
  }

  /**
   * Clears any pending hover timeout to prevent premature menu closing.
   */
  clearHoverTimeout() {
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }
  }

  /**
   * Prevents the default focus behavior and removes focus from the event target.
   * Used to manage focus styling or accessibility.
   * @param event FocusEvent to prevent default behavior
   */
  preventFocus(event: FocusEvent): void {
    event.preventDefault();
    (event.target as HTMLElement).blur();
  }

  /**
   * Navigates to the first menu item programmatically.
   * Opens external links in a new tab or routes internally.
   * Closes the menu afterward.
   * @param event MouseEvent to stop propagation
   */
  navigateToFirst(event: MouseEvent): void {
    event.stopPropagation();
    const firstItem = this.actionMenuItems[0]?.[0];
    if (!firstItem) return;

    if (firstItem.external) {
      window.open(String(firstItem.routerLink), '_blank');
      this.closeMenuIfOpen();
    } else if (firstItem.routerLink) {
      this.router.navigate(firstItem.routerLink).then(() => {
        this.closeMenuIfOpen();
      });
    }
  }

  /**
   * Returns true if mouse pointer is outside both the trigger button and menu panel.
   * @param event MouseEvent to get pointer location
   */
  isPointerOutside(event: MouseEvent): boolean {
    const x = event.clientX;
    const y = event.clientY;

    const hoveredElement = document.elementFromPoint(x, y);

    const insideTrigger = this.triggerButton.nativeElement.contains(hoveredElement);
    const insideMenu = hoveredElement?.closest(`#${this.menuPanelId ?? ''}`);

    return !(insideTrigger || insideMenu);
  }

  /**
   * Checks if the mouse pointer is outside both the trigger button and menu panel,
   * and closes the menu if so. This method is called on every mousemove event globally.
   * @param event MouseEvent containing pointer coordinates
   */
  checkPointerOutside(event: MouseEvent) {
    if (!this.openOnMouseEnter || !this.enableHoverClose) return;
    if (this.isPointerOutside(event)) {
      this.trigger.closeMenu();
    }
  }

  /**
   * Helper methods to check if the provided icon name matches a known FontAwesome icon.
   * @param name The icon name string to check
   * @returns True if the icon name matches the specific FontAwesome icon
   */
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
}
