import { BehaviorSubject, Observable, forkJoin, map, take } from 'rxjs';

import { Injectable } from '@angular/core';

import { JGlobalPermissionGroup, Permission } from '@models/global-permission-group.model';
import { ResponseWrapper } from '@models/response.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

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
    private serializer: JsonAPISerializer,
    private storage: LocalStorageService<Permission>
  ) {}

  /**
   * Loads the current user's permissions and stores them internally.
   * Uses localStorage cache valid for 15 minutes.
   */
  loadPermissions(): Observable<Permission> {
    const cached = this.storage.getItem(this.STORAGE_KEY);
    console.trace('[PermissionService] loadPermissions() called', 'cached =', cached);
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
        this.storage.setItem(this.STORAGE_KEY, permissions, this.CACHE_DURATION_MS);

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
   *
   * @param key - The permission key to check.
   * @returns An observable that emits `true` if the permission is granted.
   */
  hasPermission(key: PermissionValues): Observable<boolean> {
    return this.getPermissions().pipe(map((permissions) => !!permissions[key]));
  }

  /**
   * Asynchronously checks multiple permissions.
   *
   * @param keys - Array of permission keys.
   * @returns An observable that emits an array of booleans.
   */
  hasPermissions(keys: PermissionValues[]): Observable<boolean[]> {
    const observables = keys.map((key) => this.hasPermission(key));
    return forkJoin(observables);
  }

  /**
   * Asynchronously checks whether all specified permissions are granted.
   *
   * @param keys - Array of permission keys.
   * @returns An observable that emits `true` if all permissions are granted.
   */
  hasAllPermissions(keys: PermissionValues[]): Observable<boolean> {
    return this.hasPermissions(keys).pipe(map((results) => results.every(Boolean)));
  }

  // ----------- Synchronous Methods -----------

  /**
   * Synchronously checks if a specific permission is granted.
   *
   * @param key - The permission key to check.
   * @returns `true` if granted, otherwise `false`.
   */
  hasPermissionSync(key: PermissionValues): boolean {
    return !!this.currentPermissions?.[key];
  }

  /**
   * Synchronously checks multiple permissions.
   *
   * @param keys - Array of permission keys.
   * @returns Array of booleans indicating whether each permission is granted.
   */
  hasPermissionsSync(keys: PermissionValues[]): boolean[] {
    return keys.map((key) => this.hasPermissionSync(key));
  }

  /**
   * Synchronously checks whether all specified permissions are granted.
   *
   * @param keys - Array of permission keys.
   * @returns `true` if all permissions are granted.
   */
  hasAllPermissionsSync(keys: PermissionValues[]): boolean {
    return keys.every((key) => this.hasPermissionSync(key));
  }

  // ----------- Caching Methods -----------

  /**
   * Clears the permission cache manually (e.g. on logout).
   */
  clearPermissionCache(): void {
    this.storage.removeItem(this.STORAGE_KEY);
  }
}
