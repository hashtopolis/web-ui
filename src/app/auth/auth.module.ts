import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AuthGuard } from "../core/_guards/auth.guard";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
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
    FormsModule,
    NgbModule
  ]
})
export class AuthModule {}
