import { FormComponent } from '../core/_components/forms/simple-forms/form.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IsAuth } from '../core/_guards/auth.guard';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ComponentsModule } from '../shared/components.module';
import { AuthComponent } from './auth.component';
import { CoreFormsModule } from '../shared/forms.module';
import { AuthRoutingModule } from './auth-routing.module';
import { SERV } from '@services/main.config';

@NgModule({
  declarations: [AuthComponent],
  imports: [
    AuthRoutingModule,
    RouterModule.forChild([
      { path: 'auth', component: AuthComponent },
      {
        path: 'auth/forgot',
        component: FormComponent,
        data: {
          kind: 'authforgot',
          type: 'helper',
          serviceConfig: SERV.FORGOT,
          showDeleteButton: false
        }
      }
    ]),
    CoreFormsModule,
    ComponentsModule,
    CommonModule,
    FormsModule,
    NgbModule
  ]
})
export class AuthModule {}
