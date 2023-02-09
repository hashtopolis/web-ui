import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { AuthComponent } from "./auth.component";
import { ForgotComponent } from "./forgot/forgot.component";
import { ComponentsModule } from "../shared/components.module";


@NgModule({
  declarations:[
    AuthComponent,
    ForgotComponent
  ],
  imports:[
    CommonModule,
    RouterModule.forChild([
      {path: 'auth', component: AuthComponent},
      {path: 'auth/forgot', component: ForgotComponent}
    ]),
    FontAwesomeModule,
    FormsModule,
    NgbModule,
    ComponentsModule
  ]
})
export class AuthModule {}
