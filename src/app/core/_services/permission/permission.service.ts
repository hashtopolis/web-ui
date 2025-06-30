import { BehaviorSubject, Observable, forkJoin, map, take } from 'rxjs';

import { Injectable } from '@angular/core';

import { JGlobalPermissionGroup, Permission } from '@models/global-permission-group.model';
import { ResponseWrapper } from '@models/response.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';

import { Perm, PermissionResource, PermissionType } from '@src/app/core/_constants/userpermissions.config';

/**
 * Represents a single CRUD permission for a single resource
 *
 * @property resource - The resource for which the permission is checked (e.g., "Agent").
 * @property type - The type of permission being checked (e.g., "CREATE", "READ", "UPDATE", "DELETE").
 */
interface PermissionCheck {
  resource: PermissionResource;
  type: PermissionType;
}

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private permissions$ = new BehaviorSubject<Permission>({});

  constructor(
    private gs: GlobalService,
    private serializer: JsonAPISerializer
  ) {}

  /**
   * Loads the permissions once and stores them in BehaviorSubject
   */
  loadPermissions(): Observable<Permission> {
    return this.gs.ghelper(SERV.HELPER, 'getUserPermission').pipe(
      take(1),
      map((response: ResponseWrapper) => {
        const responseData = { data: response.data, included: response.included };
        const globalPermissionGroup = this.serializer.deserialize<JGlobalPermissionGroup>(responseData);
        const permissions = globalPermissionGroup.permissions;
        this.permissions$.next(permissions);
        return permissions;
      })
    );
  }

  /**
   * Get permissions as Observable from the BehaviourSubject
   */
  getPermissions(): Observable<Permission> {
    return this.permissions$.asObservable();
  }

  /**
   * Checks if a specific permission is granted for a given resource and permission type.
   *
   * @param resource Permission resource (e.g. "Agent")
   * @param type Type of CRUD permission (e.g. "CREATE", "READ", "UPDATE", "DELETE")
   * @returns Observable that emits `true` if permission is granted, `false` otherwise
   *
   * @example
   * this.hasPermission('Agent', 'CREATE').subscribe(hasAccess => {
   *   if (hasAccess) {
   *     console.log('User can create agents');
   *   } else {
   *     console.log('Access denied');
   *   }
   * });
   */
  hasPermission(resource: PermissionResource, type: PermissionType): Observable<boolean> {
    const perm = (Perm[resource] as Record<string, string>)[type];
    return this.getPermissions().pipe(
      map((permissions) => {
        return permissions[perm];
      })
    );
  }

  /**
   * Checks if a set of permissions are granted.
   *
   * Each permission is defined by a resource and a permission type (CRUD).
   * Returns an array of booleans indicating whether each permission is granted.
   *
   * @param checks Array with resource and type
   * @returns Observable emitting an array of booleans corresponding to each permission check
   *
   * @example
   * const checks = [
   *   { resource: 'Agent', type: 'CREATE' },
   *   { resource: 'User', type: 'READ' },
   *   { resource: 'Task', type: 'DELETE' }
   * ];
   *
   * this.hasPermissions(checks).subscribe(results => {
   *   console.log(results); // Example output: [true, false, true]
   * });
   */
  hasPermissions(checks: PermissionCheck[]): Observable<boolean[]> {
    const observables = checks.map((check) => this.hasPermission(check.resource, check.type));
    return forkJoin(observables);
  }

  /**
   * Checks if all specified permissions are granted.
   *
   * Emits `true` if every permission in the input array is granted; otherwise emits `false`.
   *
   * @param checks Array with resource and type permission checks
   * @returns Observable emitting a single boolean indicating if all permissions are granted
   *
   * @example
   * const checks = [
   *   { resource: 'Agent', type: 'CREATE' },
   *   { resource: 'User', type: 'READ' }
   * ];
   *
   * this.hasAllPermissions(checks).subscribe(allGranted => {
   *   if (allGranted) {
   *     console.log('User has all requested permissions');
   *   } else {
   *     console.log('User is missing one or more permissions');
   *   }
   * });
   */
  hasAllPermissions(checks: PermissionCheck[]): Observable<boolean> {
    return this.hasPermissions(checks).pipe(map((results) => results.every((granted) => granted)));
  }
}
