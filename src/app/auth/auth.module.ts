import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SERV } from '@services/main.config';

import { FormComponent } from '@components/forms/simple-forms/form.component';

import { AuthRoutingModule } from '@src/app/auth/auth-routing.module';
import { AuthComponent } from '@src/app/auth/auth.component';
import { ComponentsModule } from '@src/app/shared/components.module';
import { CoreFormsModule } from '@src/app/shared/forms.module';

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
