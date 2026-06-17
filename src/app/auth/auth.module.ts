import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AuthRoutingModule } from '@src/app/auth/auth-routing.module';
import { AuthComponent } from '@src/app/auth/auth.component';
import { ForgotPasswordComponent } from '@src/app/auth/forgot-password/forgot-password.component';
import { ComponentsModule } from '@src/app/shared/components.module';
import { CoreFormsModule } from '@src/app/shared/forms.module';

@NgModule({
  declarations: [AuthComponent, ForgotPasswordComponent],
  imports: [
    AuthRoutingModule,
    RouterModule.forChild([
      { path: 'auth', component: AuthComponent },
      { path: 'auth/forgot', component: ForgotPasswordComponent }
    ]),
    CoreFormsModule,
    ComponentsModule,
    CommonModule,
    FormsModule
  ]
})
export class AuthModule {}
