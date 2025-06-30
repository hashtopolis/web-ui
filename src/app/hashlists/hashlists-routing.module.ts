import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MyRoute } from '@models/routes.model';

import { NewSuperhashlistComponent } from '@components/forms/custom-forms/superhashlist/new-superhashlist/new-superhashlist.component';

import { Perm } from '@src/app/core/_constants/userpermissions.config';
import { IsAuth } from '@src/app/core/_guards/auth.guard';
import { CheckPerm } from '@src/app/core/_guards/permission.guard';
import { EditHashlistComponent } from '@src/app/hashlists/edit-hashlist/edit-hashlist.component';
import { HashesComponent } from '@src/app/hashlists/hashes/hashes.component';
import { HashlistComponent } from '@src/app/hashlists/hashlist/hashlist.component';
import { ImportCrackedHashesComponent } from '@src/app/hashlists/import-cracked-hashes/import-cracked-hashes.component';
import { NewHashlistComponent } from '@src/app/hashlists/new-hashlist/new-hashlist.component';
import { SearchHashComponent } from '@src/app/hashlists/search-hash/search-hash.component';
import { ShowCracksComponent } from '@src/app/hashlists/show-cracks/show-cracks.component';
import { SuperhashlistComponent } from '@src/app/hashlists/superhashlist/superhashlist.component';

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
          permission: Perm.Hashlist.READ
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'archived',
        component: HashlistComponent,
        data: {
          kind: 'archived',
          breadcrumb: 'Hashlist Archived',
          permission: Perm.Hashlist.READ
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'hashlist/:id/edit',
        component: EditHashlistComponent,
        data: {
          kind: 'edit-hashlist',
          breadcrumb: 'Edit Hashlist',
          permission: Perm.Hashlist.READ
        },
        canActivate: [CheckPerm]
        // canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'hashlist/:id/import-cracked-hashes',
        component: ImportCrackedHashesComponent,
        data: {
          kind: 'import-cracked-hashes',
          breadcrumb: 'Import Cracked Hashes',
          permission: Perm.Hashlist.UPDATE
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'new-hashlist',
        component: NewHashlistComponent,
        data: {
          kind: 'new-hashlist',
          breadcrumb: 'New Hashlist',
          permission: Perm.SuperHashlist.CREATE
        },
        canActivate: [CheckPerm]
        // canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'superhashlist',
        component: SuperhashlistComponent,
        data: {
          kind: 'super-hashlist',
          breadcrumb: 'Super Hashlist',
          permission: Perm.SuperHashlist.READ
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'superhashlist/:id/edit',
        component: EditHashlistComponent,
        data: {
          kind: 'edit-super-hashlist',
          breadcrumb: 'Edit Super Hashlist',
          permission: Perm.SuperHashlist.READ
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'new-superhashlist',
        component: NewSuperhashlistComponent,
        data: {
          kind: 'new-superhashlist',
          breadcrumb: 'New Super Hashlist',
          permission: Perm.SuperHashlist.CREATE
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'hashes/tasks/:id',
        component: HashesComponent,
        data: {
          kind: 'taskhas',
          breadcrumb: 'Task Hashes',
          permission: Perm.Hash.READ
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'hashes/hashlists/:id',
        component: HashesComponent,
        data: {
          kind: 'hashlisthash',
          breadcrumb: 'Hashlist Hashes',
          permission: Perm.Hash.READ
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'hashes/chunks/:id',
        component: HashesComponent,
        data: {
          kind: 'chunkshash',
          breadcrumb: 'Chunks Hashes',
          permission: Perm.Hash.READ
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'search-hash',
        component: SearchHashComponent,
        data: {
          kind: 'search-hash',
          breadcrumb: 'Search-hash',
          permission: Perm.Hash.READ
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'show-cracks',
        component: ShowCracksComponent,
        data: {
          kind: 'show-cracks',
          breadcrumb: 'Show Cracks',
          permission: Perm.Hash.READ
        },
        canActivate: [CheckPerm]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HashlistRoutingModule {}
