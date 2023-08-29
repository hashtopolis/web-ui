import { CheckPerm } from "../core/_guards/permission.guard";
import { Routes, RouterModule } from '@angular/router';
import { IsAuth } from "../core/_guards/auth.guard";
import { NgModule } from "@angular/core";

import { NewSuperhashlistComponent } from "./new-superhashlist/new-superhashlist.component";
import { SuperhashlistComponent } from "./superhashlist/superhashlist.component";
import { EditHashlistComponent } from "./edit-hashlist/edit-hashlist.component";
import { NewHashlistComponent } from "./new-hashlist/new-hashlist.component";
import { PendingChangesGuard } from "../core/_guards/pendingchanges.guard";
import { SearchHashComponent } from "./search-hash/search-hash.component";
import { ShowCracksComponent } from "./show-cracks/show-cracks.component";
import { HashlistComponent } from "./hashlist/hashlist.component";
import { HashesComponent } from "./hashes/hashes.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'hashlist', component: HashlistComponent,
        data: {
            kind: 'hashlist',
            breadcrumb: 'Hashlist',
            permission: 'Hashlist'
        },
        canActivate: [IsAuth,CheckPerm]},
      {
        path: 'archived', component: HashlistComponent,
        data: {
            kind: 'archived',
            breadcrumb: 'Hashlist Archived',
            permission: 'Hashlist'
        },
        canActivate: [IsAuth,CheckPerm]},
      {
        path: 'hashlist/:id/edit', component: EditHashlistComponent,
        data: {
            kind: 'edit-hashlist',
            breadcrumb: 'Edit Hashlist',
            permission: 'Hashlist'
        },
        canActivate: [IsAuth,CheckPerm],
        // canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'new-hashlist', component: NewHashlistComponent,
        data: {
            kind: 'new-hashlist',
            breadcrumb: 'New Hashlist',
            permission: 'SuperHashlist'
        },
        canActivate: [IsAuth,CheckPerm],
        // canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'superhashlist', component: SuperhashlistComponent,
        data: {
            kind: 'super-hashlist',
            breadcrumb: 'Super Hashlist',
            permission: 'SuperHashlist'
        },
        canActivate: [IsAuth,CheckPerm]},
      {
        path: 'superhashlist/:id/edit', component: EditHashlistComponent,
        data: {
            kind: 'edit-super-hashlist',
            breadcrumb: 'Edit Super Hashlist',
            permission: 'SuperHashlist'
        },
        canActivate: [IsAuth,CheckPerm]},
      {
        path: 'new-superhashlist', component: NewSuperhashlistComponent,
        data: {
            kind: 'new-superhashlist',
            breadcrumb: 'New Super Hashlist',
            permission: 'SuperHashlist'
        },
        canActivate: [IsAuth,CheckPerm]},
      {
        path: 'hashes/tasks/:id', component: HashesComponent,
        data: {
            kind: 'taskhas',
            breadcrumb: 'Task Hashes',
            permission: 'Hash'
        },
        canActivate: [IsAuth,CheckPerm]},
      {
        path: 'hashes/hashlists/:id', component: HashesComponent,
        data: {
            kind: 'hashlisthash',
            breadcrumb: 'Hashlist Hashes',
            permission: 'Hash'
        },
        canActivate: [IsAuth,CheckPerm]},
      {
        path: 'hashes/chunks/:id', component: HashesComponent,
        data: {
            kind: 'chunkshash',
            breadcrumb: 'Chunks Hashes',
            permission: 'Hash'
        },
        canActivate: [IsAuth,CheckPerm]},
      {
        path: 'search-hash', component: SearchHashComponent,
        data: {
            kind: 'search-hash',
            breadcrumb: 'Search-hash',
            permission: 'Hash'
        },
        canActivate: [IsAuth,CheckPerm]},
      {
        path: 'show-cracks', component: ShowCracksComponent,
        data: {
            kind: 'show-cracks',
            breadcrumb: 'Show Cracks',
            permission: 'Hash'
        },
        canActivate: [IsAuth,CheckPerm]},
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]

})
export class HashlistRoutingModule {}
