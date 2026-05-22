import { NgModule } from '@angular/core';

import { HomeComponentsModule } from '@src/app/home/home-components.module';
import { HomeRoutingModule } from '@src/app/home/home-routing.module';

@NgModule({
  imports: [HomeComponentsModule, HomeRoutingModule],
  exports: [HomeComponentsModule]
})
export class HomeModule {}
