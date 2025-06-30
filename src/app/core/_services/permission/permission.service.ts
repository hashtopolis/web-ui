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
  private currentPermissions: Permission = {}; // Cached for sync access

  constructor(
    private gs: GlobalService,
    private serializer: JsonAPISerializer
  ) {}

  /**
   * Loads the current user's permissions and stores them internally.
   */
  loadPermissions(): Observable<Permission> {
    return this.gs.ghelper(SERV.HELPER, 'getUserPermission').pipe(
      take(1),
      map((response: ResponseWrapper) => {
        const responseData = { data: response.data, included: response.included };
        const globalPermissionGroup = this.serializer.deserialize<JGlobalPermissionGroup>(responseData);
        const permissions = globalPermissionGroup.permissions;
        this.currentPermissions = permissions;
        this.permissions$.next(permissions);
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
   * @param key A permission value (e.g. Perm.Agent.CREATE)
   * @returns Observable emitting true if permission is granted
   *
   * @example
   * this.hasPermission(Perm.Agent.READ).subscribe(granted => {
   *   if (granted) {
   *     console.log('User can read agents');
   *   }
   * });
   */
  hasPermission(key: PermissionValues): Observable<boolean> {
    return this.getPermissions().pipe(map((permissions) => !!permissions[key]));
  }

  /**
   * Asynchronously checks multiple permissions.
   *
   * @param keys Array of permission values (e.g. [Perm.User.UPDATE, Perm.Task.DELETE])
   * @returns Observable of an array of booleans for each permission check
   *
   * @example
   * this.hasPermissions([Perm.User.UPDATE, Perm.Task.DELETE]).subscribe(results => {
   *   console.log(results); // [true, false]
   * });
   */
  hasPermissions(keys: PermissionValues[]): Observable<boolean[]> {
    const observables = keys.map((key) => this.hasPermission(key));
    return forkJoin(observables);
  }

  /**
   * Asynchronously checks whether all specified permissions are granted.
   *
   * @param keys Array of permission values
   * @returns Observable emitting true if all permissions are granted
   *
   * @example
   * this.hasAllPermissions([Perm.User.READ, Perm.Config.READ]).subscribe(granted => {
   *   if (granted) this.initView();
   * });
   */
  hasAllPermissions(keys: PermissionValues[]): Observable<boolean> {
    return this.hasPermissions(keys).pipe(map((results) => results.every(Boolean)));
  }

  // ----------- Synchronous Methods -----------

  /**
   * Synchronously checks if a specific permission is granted.
   *
   * @param key A permission value (e.g. Perm.Agent.CREATE)
   * @returns True if the permission is granted
   *
   * @example
   * if (this.permissionService.hasPermissionSync(Perm.Agent.CREATE)) {
   *   this.showAgentCreateButton = true;
   * }
   */
  hasPermissionSync(key: PermissionValues): boolean {
    return !!this.currentPermissions?.[key];
  }

  /**
   * Synchronously checks multiple permissions.
   *
   * @param keys Array of permission values
   * @returns Array of booleans for each permission check
   *
   * @example
   * const checks = [Perm.Task.READ, Perm.User.DELETE];
   * const results = this.permissionService.hasPermissionsSync(checks);
   * console.log(results); // [true, false]
   */
  hasPermissionsSync(keys: PermissionValues[]): boolean[] {
    return keys.map((key) => this.hasPermissionSync(key));
  }

  /**
   * Synchronously checks whether all specified permissions are granted.
   *
   * @param keys Array of permission values
   * @returns True if all permissions are granted
   *
   * @example
   * if (this.permissionService.hasAllPermissionsSync([Perm.Task.READ, Perm.File.UPDATE])) {
   *   this.initTaskFileView();
   * }
   */
  hasAllPermissionsSync(keys: PermissionValues[]): boolean {
    return keys.every((key) => this.hasPermissionSync(key));
  }
}
