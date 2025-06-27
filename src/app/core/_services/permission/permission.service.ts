import { BehaviorSubject, Observable, map, take } from 'rxjs';

import { Injectable } from '@angular/core';

import { JGlobalPermissionGroup, Permission } from '@models/global-permission-group.model';
import { ResponseWrapper } from '@models/response.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';

import { Perm, PermissionResource, PermissionType } from '@src/app/core/_constants/userpermissions.config';

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
   * Check, if specific permission is granted
   * @param resource  Permission resource (e.g. "Agent")
   * @param type      Type of CRUD permission (e.g. "CREATE")
   */
  hasPermission(resource: PermissionResource, type: PermissionType): Observable<boolean> {
    const perm = (Perm[resource] as Record<string, string>)[type];
    return this.getPermissions().pipe(
      map((permissions) => {
        const hasAccess = permissions[perm];
        return hasAccess || typeof hasAccess === 'undefined'; // Fallback for missing permission
      })
    );
  }
}
