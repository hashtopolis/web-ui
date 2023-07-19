import { IsAuth } from "../core/_guards/auth.guard";
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from "@angular/core";

import { HomeComponent } from "./home.component";

const routes: Routes = [
  {
    path: '',
    children: [
        {
          path: '', component: HomeComponent,
          data: {
              kind: 'Home',
              breadcrumb: 'Home'
          },
          canActivate: [IsAuth]},
        ]
     }
  ]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]

})
export class HomeRoutingModule {}
