import { CheckPerm } from '../core/_guards/permission.guard';
import { RouterModule, Routes } from '@angular/router';
import { IsAuth } from '../core/_guards/auth.guard';
import { NgModule } from '@angular/core';

import { NewSuperhashlistComponent } from '../core/_components/forms/custom-forms/superhashlist/new-superhashlist/new-superhashlist.component';
import { SuperhashlistComponent } from './superhashlist/superhashlist.component';
import { EditHashlistComponent } from './edit-hashlist/edit-hashlist.component';
import { NewHashlistComponent } from './new-hashlist/new-hashlist.component';
import { PendingChangesGuard } from '../core/_guards/pendingchanges.guard';
import { SearchHashComponent } from './search-hash/search-hash.component';
import { ShowCracksComponent } from './show-cracks/show-cracks.component';
import { MyRoute, RouteData } from '../core/_models/routes.model';
import { HashlistComponent } from './hashlist/hashlist.component';
import { HashesComponent } from './hashes/hashes.component';
import { ImportCrackedHashesComponent } from './import-cracked-hashes/import-cracked-hashes.component';

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
          permission: 'Hashlist'
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'archived',
        component: HashlistComponent,
        data: {
          kind: 'archived',
          breadcrumb: 'Hashlist Archived',
          permission: 'Hashlist'
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'hashlist/:id/edit',
        component: EditHashlistComponent,
        data: {
          kind: 'edit-hashlist',
          breadcrumb: 'Edit Hashlist',
          permission: 'Hashlist'
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
          permission: 'Hashlist'
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'new-hashlist',
        component: NewHashlistComponent,
        data: {
          kind: 'new-hashlist',
          breadcrumb: 'New Hashlist',
          permission: 'SuperHashlist'
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
          permission: 'SuperHashlist'
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'superhashlist/:id/edit',
        component: EditHashlistComponent,
        data: {
          kind: 'edit-super-hashlist',
          breadcrumb: 'Edit Super Hashlist',
          permission: 'SuperHashlist'
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'new-superhashlist',
        component: NewSuperhashlistComponent,
        data: {
          kind: 'new-superhashlist',
          breadcrumb: 'New Super Hashlist',
          permission: 'SuperHashlist'
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'hashes/tasks/:id',
        component: HashesComponent,
        data: {
          kind: 'taskhas',
          breadcrumb: 'Task Hashes',
          permission: 'Hash'
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'hashes/hashlists/:id',
        component: HashesComponent,
        data: {
          kind: 'hashlisthash',
          breadcrumb: 'Hashlist Hashes',
          permission: 'Hash'
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'hashes/chunks/:id',
        component: HashesComponent,
        data: {
          kind: 'chunkshash',
          breadcrumb: 'Chunks Hashes',
          permission: 'Hash'
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'search-hash',
        component: SearchHashComponent,
        data: {
          kind: 'search-hash',
          breadcrumb: 'Search-hash',
          permission: 'Hash'
        },
        canActivate: [CheckPerm]
      },
      {
        path: 'show-cracks',
        component: ShowCracksComponent,
        data: {
          kind: 'show-cracks',
          breadcrumb: 'Show Cracks',
          permission: 'Hash'
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
