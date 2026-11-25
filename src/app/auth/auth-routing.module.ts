import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MyRoute } from '@models/routes.model';

import { AuthComponent } from '@src/app/auth/auth.component';
import { redirectAuthenticatedUser } from '@src/app/core/_guards/login.guard';

const routes: MyRoute[] = [
  {
    path: 'auth',
    children: [
      {
        path: '',
        component: AuthComponent,
        canActivate: [redirectAuthenticatedUser]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
