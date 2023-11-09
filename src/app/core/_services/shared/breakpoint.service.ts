import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

/**
 * Service for detecting the current screen breakpoint using Angular's CDK BreakpointObserver.
 * It provides methods to check for specific breakpoints such as XSmall, Small, Medium, Large, and XLarge.
 *
 * @example
 * // Inject the BreakpointService into your component or service and use it to observe breakpoints.
 * constructor(private breakpointService: BreakpointService) {
 *   this.breakpointService.isXSmall().subscribe(isXSmall => {
 *     if (isXSmall) {
 *       // Actions for XSmall breakpoint
 *     }
 *   });
 * }
 */
@Injectable({
  providedIn: 'root',
})
export class BreakpointService {

  constructor(private breakpointObserver: BreakpointObserver) { }

  /**
   * Observes the XSmall breakpoint.
   * @returns An Observable that emits a boolean value indicating whether the XSmall breakpoint is active.
   */
  isXSmall(): Observable<boolean> {
    return this.is(Breakpoints.XSmall)
  }

  /**
   * Observes the Small breakpoint.
   * @returns An Observable that emits a boolean value indicating whether the Small breakpoint is active.
   */
  isSmall(): Observable<boolean> {
    return this.is(Breakpoints.Small)
  }

  /**
   * Observes the Medium breakpoint.
   * @returns An Observable that emits a boolean value indicating whether the Medium breakpoint is active.
   */
  isMedium(): Observable<boolean> {
    return this.is(Breakpoints.Medium)
  }

  /**
   * Observes the Large breakpoint.
   * @returns An Observable that emits a boolean value indicating whether the Large breakpoint is active.
   */
  isLarge(): Observable<boolean> {
    return this.is(Breakpoints.Large)
  }

  /**
   * Observes the XLarge breakpoint.
   * @returns An Observable that emits a boolean value indicating whether the XLarge breakpoint is active.
   */
  isXLarge(): Observable<boolean> {
    return this.is(Breakpoints.XLarge)
  }

  /**
   * Internal method to observe a specific breakpoint.
   * @param breakpoint - The breakpoint to observe, such as Breakpoints.XSmall.
   * @returns An Observable that emits a boolean value indicating whether the specified breakpoint is active.
   */
  private is(breakpoint: string): Observable<boolean> {
    return this.breakpointObserver.observe(breakpoint)
      .pipe(map(result => result.matches));
  }
}