import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { requireAuth } from '@src/app/core/_guards/auth.guard';
import { MyRoute } from '@src/app/core/_models/routes.model';
import { HomeComponent } from '@src/app/home/home.component';

const routes: MyRoute[] = [
  {
    path: '',
    canActivate: [requireAuth],
    children: [
      {
        path: '',
        component: HomeComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
