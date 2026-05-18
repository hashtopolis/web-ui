import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MyRoute } from '@models/routes.model';

import { HashRoleService } from '@services/roles/hashlists/hash-role.service';
import { HashListRoleService } from '@services/roles/hashlists/hashlist-role.service';
import { SuperHashListRoleService } from '@services/roles/hashlists/superhashlist-role.service';

import { NewSuperhashlistComponent } from '@components/forms/custom-forms/superhashlist/new-superhashlist/new-superhashlist.component';

import { IsAuth } from '@src/app/core/_guards/auth.guard';
import { CheckRole } from '@src/app/core/_guards/permission.guard';
import { EditHashlistComponent } from '@src/app/hashlists/edit-hashlist/edit-hashlist.component';
import { HashesComponent } from '@src/app/hashlists/hashes/hashes.component';
import { HashlistComponent } from '@src/app/hashlists/hashlist/hashlist.component';
import { ImportCrackedHashesComponent } from '@src/app/hashlists/import-cracked-hashes/import-cracked-hashes.component';
import { NewHashlistComponent } from '@src/app/hashlists/new-hashlist/new-hashlist.component';
import { SearchHashComponent } from '@src/app/hashlists/search-hash/search-hash.component';
import { ShowCracksComponent } from '@src/app/hashlists/show-cracks/show-cracks.component';
import { SuperhashlistComponent } from '@src/app/hashlists/superhashlist/superhashlist.component';

const hashlistRoleServiceClass = HashListRoleService;
const superhashlistRoleServiceClass = SuperHashListRoleService;
const hashRoleServiceClass = HashRoleService;

const routes: MyRoute[] = [
  {
    path: '',
    canActivate: [IsAuth],
    children: [
      {
        path: 'hashlist',
        component: HashlistComponent,
        data: {
          kind: 'hashlist',
          breadcrumb: 'Hashlist',
          roleServiceClass: hashlistRoleServiceClass,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'archived',
        component: HashlistComponent,
        data: {
          kind: 'archived',
          breadcrumb: 'Hashlist Archived',
          roleServiceClass: hashlistRoleServiceClass,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'hashlist/:id/edit',
        component: EditHashlistComponent,
        data: {
          kind: 'edit-hashlist',
          breadcrumb: 'Edit Hashlist',
          roleServiceClass: hashlistRoleServiceClass,
          roleName: 'read'
        },
        canActivate: [CheckRole]
        // canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'hashlist/:id/import-cracked-hashes',
        component: ImportCrackedHashesComponent,
        data: {
          kind: 'import-cracked-hashes',
          breadcrumb: 'Import Cracked Hashes',
          roleServiceClass: hashlistRoleServiceClass,
          roleName: 'update'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'new-hashlist',
        component: NewHashlistComponent,
        data: {
          kind: 'new-hashlist',
          breadcrumb: 'New Hashlist',
          roleServiceClass: hashlistRoleServiceClass,
          roleName: 'create'
        },
        canActivate: [CheckRole]
        // canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'superhashlist',
        component: SuperhashlistComponent,
        data: {
          kind: 'super-hashlist',
          breadcrumb: 'Super Hashlist',
          roleServiceClass: superhashlistRoleServiceClass,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'superhashlist/:id/edit',
        component: EditHashlistComponent,
        data: {
          kind: 'edit-super-hashlist',
          breadcrumb: 'Edit Super Hashlist',
          roleServiceClass: superhashlistRoleServiceClass,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'new-superhashlist',
        component: NewSuperhashlistComponent,
        data: {
          kind: 'new-superhashlist',
          breadcrumb: 'New Super Hashlist',
          roleServiceClass: superhashlistRoleServiceClass,
          roleName: 'create'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'hashes/tasks/:id',
        component: HashesComponent,
        data: {
          kind: 'taskhas',
          breadcrumb: 'Task Hashes',
          roleServiceClass: hashRoleServiceClass,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'hashes/hashlists/:id',
        component: HashesComponent,
        data: {
          kind: 'hashlisthash',
          breadcrumb: 'Hashlist Hashes',
          roleServiceClass: hashRoleServiceClass,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'hashes/chunks/:id',
        component: HashesComponent,
        data: {
          kind: 'chunkshash',
          breadcrumb: 'Chunks Hashes',
          roleServiceClass: hashRoleServiceClass,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'search-hash',
        component: SearchHashComponent,
        data: {
          kind: 'search-hash',
          breadcrumb: 'Search-hash',
          roleServiceClass: hashRoleServiceClass,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      },
      {
        path: 'show-cracks',
        component: ShowCracksComponent,
        data: {
          kind: 'show-cracks',
          breadcrumb: 'Show Cracks',
          roleServiceClass: hashRoleServiceClass,
          roleName: 'read'
        },
        canActivate: [CheckRole]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HashlistRoutingModule {}
