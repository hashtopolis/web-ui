import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { IsAuth } from "../core/_guards/auth.guard";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from "@angular/material/button";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { NgModule } from "@angular/core";

import { ComponentsModule } from "../shared/components.module";
import { ForgotComponent } from "./forgot/forgot.component";
import { AuthComponent } from "./auth.component";

@NgModule({
  declarations:[
    ForgotComponent,
    AuthComponent
  ],
  imports:[
    RouterModule.forChild([
      {path: 'auth', component: AuthComponent},
      {path: 'auth/forgot', component: ForgotComponent}
    ]),
    FontAwesomeModule,
    ComponentsModule,
    CommonModule,
    MatFormFieldModule,
    MatCardModule,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    NgbModule
  ]
})
export class AuthModule {}
