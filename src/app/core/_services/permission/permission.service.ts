import { BehaviorSubject, Observable, forkJoin, map, take } from 'rxjs';

import { Injectable } from '@angular/core';

import { JGlobalPermissionGroup, Permission } from '@models/global-permission-group.model';
import { ResponseWrapper } from '@models/response.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';

import { PermissionValues } from '@src/app/core/_constants/userpermissions.config';

/**
 * Service for checking and managing user permissions.
 */

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private permissions$ = new BehaviorSubject<Permission>({});
  private currentPermissions: Permission = {}; // Cached for static access

  private readonly STORAGE_KEY = 'user_permissions';
  private readonly CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes

  constructor(
    private gs: GlobalService,
    private serializer: JsonAPISerializer
  ) {}

  /**
   * Loads the current user's permissions and stores them internally.
   * Uses localStorage cache valid for 15 minutes.
   */
  loadPermissions(): Observable<Permission> {
    const cached = this.getPermissionsFromCache();

    if (cached) {
      this.currentPermissions = cached;
      this.permissions$.next(cached);
      return new BehaviorSubject(cached).asObservable();
    }

    return this.gs.ghelper(SERV.HELPER, 'getUserPermission').pipe(
      take(1),
      map((response: ResponseWrapper) => {
        const responseData = { data: response.data, included: response.included };
        const globalPermissionGroup = this.serializer.deserialize<JGlobalPermissionGroup>(responseData);
        const permissions = globalPermissionGroup.permissions;

        this.currentPermissions = permissions;
        this.permissions$.next(permissions);
        this.savePermissionsToCache(permissions);

        return permissions;
      })
    );
  }

  /**
   * Returns the loaded permissions as an observable.
   */
  getPermissions(): Observable<Permission> {
    return this.permissions$.asObservable();
  }

  /**
   * Asynchronously checks whether a specific permission is granted.
   */
  hasPermission(key: PermissionValues): Observable<boolean> {
    return this.getPermissions().pipe(map((permissions) => !!permissions[key]));
  }

  /**
   * Asynchronously checks multiple permissions.
   */
  hasPermissions(keys: PermissionValues[]): Observable<boolean[]> {
    const observables = keys.map((key) => this.hasPermission(key));
    return forkJoin(observables);
  }

  /**
   * Asynchronously checks whether all specified permissions are granted.
   */
  hasAllPermissions(keys: PermissionValues[]): Observable<boolean> {
    return this.hasPermissions(keys).pipe(map((results) => results.every(Boolean)));
  }

  // ----------- Synchronous Methods -----------

  /**
   * Synchronously checks if a specific permission is granted.
   */
  hasPermissionSync(key: PermissionValues): boolean {
    return !!this.currentPermissions?.[key];
  }

  /**
   * Synchronously checks multiple permissions.
   */
  hasPermissionsSync(keys: PermissionValues[]): boolean[] {
    return keys.map((key) => this.hasPermissionSync(key));
  }

  /**
   * Synchronously checks whether all specified permissions are granted.
   */
  hasAllPermissionsSync(keys: PermissionValues[]): boolean {
    return keys.every((key) => this.hasPermissionSync(key));
  }

  // ----------- Caching Methods -----------

  /**
   * Retrieves permissions from localStorage if not expired.
   */
  private getPermissionsFromCache(): Permission | null {
    const item = localStorage.getItem(this.STORAGE_KEY);
    if (!item) return null;

    try {
      const { timestamp, permissions } = JSON.parse(item);
      const isExpired = Date.now() - timestamp > this.CACHE_DURATION_MS;
      return isExpired ? null : permissions;
    } catch {
      return null;
    }
  }

  /**
   * Saves permissions to localStorage with a timestamp.
   */
  private savePermissionsToCache(permissions: Permission): void {
    const payload = {
      permissions,
      timestamp: Date.now()
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(payload));
  }

  /**
   * Clears the permission cache manually (e.g. on logout).
   */
  clearPermissionCache(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
