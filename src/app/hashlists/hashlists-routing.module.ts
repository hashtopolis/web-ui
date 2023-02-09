import { AuthGuard } from "../core/_guards/auth.guard";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';

import { HashlistComponent } from "./hashlist/hashlist.component";
import { NewHashlistComponent } from "./new-hashlist/new-hashlist.component";
import { EditHashlistComponent } from "./edit-hashlist/edit-hashlist.component";
import { SuperhashlistComponent } from "./superhashlist/superhashlist.component";
import { NewSuperhashlistComponent } from "./new-superhashlist/new-superhashlist.component";
import { SearchHashComponent } from "./search-hash/search-hash.component";
import { ShowCracksComponent } from "./show-cracks/show-cracks.component";
import { PendingChangesGuard } from "../core/_guards/pendingchanges.guard";


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'hashlist', component: HashlistComponent,
        data: {
            kind: 'hashlist',
            breadcrumb: 'Hashlist'
        },
        canActivate: [AuthGuard]},
      {
        path: 'archived', component: HashlistComponent,
        data: {
            kind: 'archived',
            breadcrumb: 'Hashlist Archived'
        },
        canActivate: [AuthGuard]},
      {
        path: 'hashlist/:id/edit', component: EditHashlistComponent,
        data: {
            kind: 'edit-hashlist',
            breadcrumb: 'Edit Hashlist'
        },
        canActivate: [AuthGuard],
        canDeactivate: [PendingChangesGuard]},
      {
        path: 'new-hashlist', component: NewHashlistComponent,
        data: {
            kind: 'new-hashlist',
            breadcrumb: 'New Hashlist'
        },
        canActivate: [AuthGuard],
        canDeactivate: [PendingChangesGuard]},
      {
        path: 'superhashlist', component: SuperhashlistComponent,
        data: {
            kind: 'super-hashlist',
            breadcrumb: 'Super Hashlist'
        },
        canActivate: [AuthGuard]},
      {
        path: 'new-superhashlist', component: NewSuperhashlistComponent,
        data: {
            kind: 'new-superhashlist',
            breadcrumb: 'New Super Hashlist'
        },
        canActivate: [AuthGuard]},
      {
        path: 'search-hash', component: SearchHashComponent,
        data: {
            kind: 'search-hash',
            breadcrumb: 'Search-hash'
        },
        canActivate: [AuthGuard]},
      {
        path: 'show-cracks', component: ShowCracksComponent,
        data: {
            kind: 'show-cracks',
            breadcrumb: 'Show Cracks'
        },
        canActivate: [AuthGuard]},
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]

})
export class HashlistRoutingModule {}
