import { CheckMarkComponent } from './check-mark/check-mark.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LottieModule } from 'ngx-lottie';
import { NgModule } from '@angular/core';
import player from "lottie-web";

// Export this function
export function playerFactory() {
  return player;
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    LottieModule.forRoot({ player: playerFactory })
  ],
  exports: [
    CheckMarkComponent
  ],
  declarations: [
    CheckMarkComponent
  ]
})
export class LottiesModule { }
