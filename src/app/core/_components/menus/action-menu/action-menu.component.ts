// typescript
import { faDiscord, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faGlobe, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { faBook, faSquarePlus } from '@fortawesome/free-solid-svg-icons';
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
  styleUrls: ['./action-menu.component.scss'],
  standalone: false
})
/**
 * ActionMenuComponent
 *
 * Small dropdown/action menu component that supports:
 * - opening on hover or click (`openOnMouseEnter`)
 * - optional hover-to-close behavior with a short grace period (`enableHoverClose`)
 * - routing, external links, and custom menu item click events
 *
 * The component uses a global `mousemove` listener while the menu is open to detect
 * pointer exits and applies a short deferred close to avoid flicker when moving
 * between trigger and menu.
 */
export class ActionMenuComponent implements OnInit, AfterViewInit, OnDestroy {
  /** Delay in milliseconds to prevent hover flickering */
  static readonly hoverDelayMs = 30;

  private subscriptions: Subscription[] = [];

  /** Handle to remove the global mousemove listener */
  private globalMouseMoveListener: (() => void) | null = null;

  /** Handle for the deferred hover-close timeout */
  hoverTimeout: ReturnType<typeof setTimeout> | null = null;
  menuPanelId: string | undefined;

  // track last known mouse coords for deferred checks
  private lastMouseX = 0;
  private lastMouseY = 0;

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

  faDiscord = faDiscord;
  faGithub = faGithub;
  faPaperplane = faPaperPlane;
  faGlobe = faGlobe;
  faBook = faBook;
  faSquarePlus = faSquarePlus;

  isDarkMode = false;
  faIconColor = 'white';

  hoveringButton = false;
  hoveringMenu = false;

  private static openMenuTrigger: MatMenuTrigger | null = null;

  /**
   * Create the ActionMenuComponent.
   * @param router Router instance for internal navigation
   * @param storage Local storage utility used for reading UI settings
   * @param renderer Renderer2 for attaching global event listeners safely
   */
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
   * Angular lifecycle hook: subscribes to router events to update active state
   * and close the menu when navigation occurs.
   */
  ngOnInit(): void {
    this.subscriptions.push(
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.currentUrl = event.url.split('/').slice(1);
          this.checkIsActive();

          if (this.trigger?.menuOpen) {
            this.trigger.closeMenu();
          }
        }
      })
    );
  }

  /**
   * Angular lifecycle hook: called after view init. Captures the menu panel id
   * and subscribes to menu open/close events to manage the global mouse listener.
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
        }, ActionMenuComponent.hoverDelayMs);
      })
    );
  }

  /**
   * Add a single global mousemove listener to track pointer position while menu is open.
   * The listener updates last known coordinates and delegates to `checkPointerOutside`.
   */
  addGlobalMouseListener() {
    if (this.globalMouseMoveListener) return;

    this.globalMouseMoveListener = this.renderer.listen('document', 'mousemove', (event: MouseEvent) => {
      // always keep last coords up to date
      this.lastMouseX = event.clientX;
      this.lastMouseY = event.clientY;
      this.checkPointerOutside(event);
    });
  }

  /**
   * Remove the global mousemove listener if present.
   */
  removeGlobalMouseListener() {
    if (this.globalMouseMoveListener) {
      this.globalMouseMoveListener();
      this.globalMouseMoveListener = null;
    }
  }

  /**
   * Angular lifecycle hook: unsubscribe and clean up global listener.
   */
  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
    this.removeGlobalMouseListener();
  }

  /**
   * Sets `isActive` based on whether the current route matches any configured menu item.
   * Used to apply an `active` CSS state to the trigger button.
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
   * Handle a menu item click:
   * - internal route -> navigate
   * - external -> open new tab
   * - otherwise emit `menuItemClicked`
   * Closes the menu after handling.
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
   * Handle clicking the add button inside a menu item.
   */
  onAddMenuItemClick(menuItem: ActionMenuItem): void {
    if (menuItem.routerLinkAdd && !menuItem.external) {
      this.router.navigate(menuItem.routerLinkAdd).then(() => {
        this.closeMenuIfOpen();
      });
    }
  }

  /**
   * Close the menu if it is currently open.
   */
  closeMenuIfOpen(): void {
    if (this.trigger?.menuOpen) {
      this.trigger.closeMenu();
    }
  }

  /**
   * Mouse entered the trigger button: open menu (when configured) and clear any pending close.
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
   * Mouse left the trigger button: record coordinates and start deferred close.
   */
  onMouseLeave(event: MouseEvent): void {
    this.hoveringButton = false;
    // capture last coords immediately so timeout checks current pointer
    this.lastMouseX = event.clientX;
    this.lastMouseY = event.clientY;
    this.startHoverTimeout();
  }

  /**
   * Mouse entered the menu panel: cancel any pending close.
   */
  onMenuMouseEnter(): void {
    this.hoveringMenu = true;
    this.clearHoverTimeout();
  }

  /**
   * Mouse left the menu panel: record coordinates and start deferred close.
   */
  onMenuMouseLeave(event: MouseEvent): void {
    this.hoveringMenu = false;
    this.lastMouseX = event.clientX;
    this.lastMouseY = event.clientY;
    this.startHoverTimeout();
  }

  /**
   * Start a single deferred timeout to check pointer position after a short grace period.
   * If the pointer is still outside the trigger and menu, close the menu.
   */
  startHoverTimeout() {
    if (!this.openOnMouseEnter || !this.enableHoverClose) return;

    // prevent multiple timers
    this.clearHoverTimeout();

    this.hoverTimeout = setTimeout(() => {
      try {
        if (this.isPointerOutsideAt(this.lastMouseX, this.lastMouseY)) {
          this.closeMenuIfOpen();
        }
      } finally {
        // ensure we clear the stored timeout handle
        this.hoverTimeout = null;
      }
    }, ActionMenuComponent.hoverDelayMs);
  }

  /**
   * Cancel any pending hover-close timeout.
   */
  clearHoverTimeout() {
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }
  }

  /**
   * Prevent default focus behavior and blur the event target.
   * Useful to avoid focus styling when the trigger is activated by mouse.
   */
  preventFocus(event: FocusEvent): void {
    event.preventDefault();
    (event.target as HTMLElement).blur();
  }

  /**
   * Programmatically navigate to the first menu item (used when trigger is clicked).
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
   * Determine whether a given screen coordinate is outside the trigger button and menu panel.
   * Returns `true` when pointer is outside both.
   */
  isPointerOutsideAt(x: number, y: number): boolean {
    const hoveredElement = document.elementFromPoint(x, y);

    const insideTrigger = this.triggerButton?.nativeElement.contains(hoveredElement);
    const insideMenu = hoveredElement?.closest(`#${this.menuPanelId ?? ''}`);

    return !(insideTrigger || insideMenu);
  }

  /**
   * Called by the global mousemove handler to decide whether to schedule a deferred close
   * or cancel one when the pointer returns inside.
   */
  checkPointerOutside(event: MouseEvent) {
    if (!this.openOnMouseEnter || !this.enableHoverClose) return;

    // update last coords (already done in global listener, but keep safe)
    this.lastMouseX = event.clientX;
    this.lastMouseY = event.clientY;

    if (this.isPointerOutsideAt(this.lastMouseX, this.lastMouseY)) {
      // schedule closure after grace period
      this.startHoverTimeout();
    } else {
      // pointer is inside — cancel any pending close
      this.clearHoverTimeout();
    }
  }

  /**
   * Icon helper checks: return true when the provided name matches a specific icon key.
   * These helpers are intentionally defensive (handle undefined).
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
