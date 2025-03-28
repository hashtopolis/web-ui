import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HomeComponent } from '@src/app/home/home.component';
import { IsAuth } from '@src/app/core/_guards/auth.guard';
import { MyRoute } from '@src/app/core/_models/routes.model';

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
