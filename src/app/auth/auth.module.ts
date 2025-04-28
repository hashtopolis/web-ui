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

@NgModule({
  declarations: [AuthComponent],
  imports: [
    RouterModule.forChild([
      { path: 'auth', component: AuthComponent },
      {
        path: 'auth/forgot',
        component: FormComponent,
        data: {
          kind: 'authforgot',
          type: 'create'
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
