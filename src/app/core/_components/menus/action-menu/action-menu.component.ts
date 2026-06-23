// typescript
import { faDiscord, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faGlobe, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { faBook, faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';

import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
  inject
} from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { NavigationEnd, Router } from '@angular/router';

import { BaseModel } from '@models/base.model';

import { ThemeService } from '@services/shared/theme.service';

import { ActionMenuEvent, ActionMenuItem } from '@components/menus/action-menu/action-menu.model';

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
 */
export class ActionMenuComponent implements OnInit, AfterViewInit, OnDestroy {
  /** Grace period (ms) before a hover-close fires, long enough to cross the gap
   *  between trigger and panel. */
  static readonly hoverCloseDelayMs = 150;

  private subscriptions: Subscription[] = [];

  /** Handle for the deferred hover-close timeout */
  hoverTimeout: ReturnType<typeof setTimeout> | null = null;

  /** Cleanup handles for the overlay-panel hover listeners. */
  private panelListeners: (() => void)[] = [];

  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;

  currentUrl: string[] = [];
  isActive = false;

  @Input() icon: string = '';
  @Input() label: string = '';
  @Input() disabled = false;
  @Input() disabledTooltip = '';
  @Input() cls = '';
  @Input() panelClass = '';
  @Input() data: BaseModel | undefined;
  @Input() actionMenuItems: ActionMenuItem[][] = [];

  @Input() openOnMouseEnter = false;

  /**
   * If true, enable hover-close behavior. Useful for cases
   * where the menu should close when leaving mouse outside.
   */
  @Input() enableHoverClose = false;

  @Output() menuItemClicked: EventEmitter<ActionMenuEvent<BaseModel | undefined>> = new EventEmitter<
    ActionMenuEvent<BaseModel | undefined>
  >();

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

  /**
   * Maximum viewport width (px) below which we treat the layout as "mobile"
   * regardless of pointer type. Aligns with the dashboard's `<= sm` breakpoint.
   */
  private static readonly mobileBreakpointPx = 768;

  /**
   * True when the layout is desktop-like: a fine-pointer device with hover
   * capability AND a viewport wider than the mobile breakpoint. On mobile
   * (touch-only OR narrow viewport) a tap fires mouseenter + click + mouseleave
   * in rapid succession, which caused the menu to open, navigate to the first
   * item, and close again in the same gesture. Hover-intent + first-item
   * navigation logic is gated behind this getter so mobile falls back to
   * standard mat-menu-trigger tap-to-toggle behavior.
   *
   * Read as a getter so viewport-resize transitions (e.g. devtools toggle)
   * pick up the new state on the next interaction.
   */
  private get isDesktopLayout(): boolean {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
    const fineHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const wideViewport = window.matchMedia(`(min-width: ${ActionMenuComponent.mobileBreakpointPx + 1}px)`).matches;
    return fineHover && wideViewport;
  }

  /**
   * @deprecated kept for backwards-compatibility with callers reading the field
   * as `supportsHover`. Reads from `isDesktopLayout` so behavior stays consistent.
   */
  private get supportsHover(): boolean {
    return this.isDesktopLayout;
  }

  private static openMenuTrigger: MatMenuTrigger | null = null;

  private router = inject(Router);
  private themeService = inject(ThemeService);
  private renderer = inject(Renderer2);

  /**
   * Angular lifecycle hook: subscribes to router events to update active state
   * and close the menu when navigation occurs.
   */
  ngOnInit(): void {
    this.subscriptions.push(
      this.themeService.isDarkMode$.subscribe((isDark) => {
        this.isDarkMode = isDark;
        this.faIconColor = isDark ? 'white' : 'black';
      })
    );

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

  ngAfterViewInit(): void {
    this.subscriptions.push(
      this.trigger.menuOpened.subscribe(() => {
        this.attachPanelHoverListeners();
      })
    );

    this.subscriptions.push(
      this.trigger.menuClosed.subscribe(() => {
        if (ActionMenuComponent.openMenuTrigger === this.trigger) {
          ActionMenuComponent.openMenuTrigger = null;
        }
        this.detachPanelHoverListeners();
        this.hoveringMenu = false;
      })
    );
  }

  /**
   * Bind mouseenter/mouseleave to the rendered overlay. Targets the
   * `.cdk-overlay-pane` wrapper, not the panel itself — Material sets
   * `pointer-events: none` on the panel during its enter animation, so attaching
   * to the pane (which stays interactive) detects hover even mid-animation.
   */
  private attachPanelHoverListeners(): void {
    if (!this.supportsHover) return;
    this.detachPanelHoverListeners();

    const panelId = this.trigger.menu?.panelId;
    const panel = panelId ? document.getElementById(panelId) : null;
    const target = panel?.closest('.cdk-overlay-pane') ?? panel;
    if (!target) return;

    this.panelListeners.push(
      this.renderer.listen(target, 'mouseenter', () => this.onMenuMouseEnter()),
      this.renderer.listen(target, 'mouseleave', () => this.onMenuMouseLeave())
    );
  }

  private detachPanelHoverListeners(): void {
    for (const unlisten of this.panelListeners) {
      unlisten();
    }
    this.panelListeners = [];
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
    this.detachPanelHoverListeners();
    this.clearHoverTimeout();
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
        for (const link of [item.routerLink, item.routerLinkAdd, ...(item.activeRoutes ?? [])]) {
          if (link?.length) {
            const partial = this.currentUrl.slice(0, link.length);
            if (partial.every((value, index) => value === link[index])) {
              this.isActive = true;
              break;
            }
          }
        }
        if (this.isActive) break;
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
    if (!this.supportsHover) return;
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

  onMouseLeave(): void {
    if (!this.supportsHover) return;
    this.hoveringButton = false;
    this.startHoverTimeout();
  }

  /**
   * Mouse entered the menu panel: cancel any pending close.
   */
  onMenuMouseEnter(): void {
    if (!this.supportsHover) return;
    this.hoveringMenu = true;
    this.clearHoverTimeout();
  }

  onMenuMouseLeave(): void {
    if (!this.supportsHover) return;
    this.hoveringMenu = false;
    this.startHoverTimeout();
  }

  /** Close after a grace period, but only if the pointer left both the trigger and the panel. */
  startHoverTimeout() {
    if (!this.openOnMouseEnter || !this.enableHoverClose) return;

    // prevent multiple timers
    this.clearHoverTimeout();

    this.hoverTimeout = setTimeout(() => {
      this.hoverTimeout = null;
      if (!this.hoveringButton && !this.hoveringMenu) {
        this.closeMenuIfOpen();
      }
    }, ActionMenuComponent.hoverCloseDelayMs);
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
   *
   * On touch devices this shortcut is disabled — a tap is indistinguishable from
   * the "open the menu" intent, so we let mat-menu-trigger's default click
   * toggle take over. Running the shortcut on touch caused the menu to open and
   * then close immediately when NavigationEnd fired.
   */
  navigateToFirst(event: MouseEvent): void {
    if (!this.supportsHover) return;
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
