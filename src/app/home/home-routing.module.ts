import { IsAuth } from '../core/_guards/auth.guard';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { MyRoute, RouteData } from '../core/_models/routes.model';
import { HomeComponent } from './home.component';

const routes: MyRoute[] = [
  {
    path: '',
    canActivate: [IsAuth],
    children: [
      {
        path: '',
        component: HomeComponent,
        data: {
          kind: 'Home',
          breadcrumb: 'Home'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
