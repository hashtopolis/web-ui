import { MyRoute } from '@models/routes.model';
import { RouterModule } from '@angular/router';
import { IsAuth } from '../core/_guards/login.guard';
import { NgModule } from '@angular/core';
import { AuthComponent } from './auth.component';

const routes: MyRoute[] = [
  {
    path: 'auth',
    children: [
    {
        path: '',
        component: AuthComponent,
        data: {
          kind: 'auth',
          breadcrumb: ''
        },
        canActivate: [IsAuth]
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
