import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

import { HomeRoutingModule } from '@src/app/home/home-routing.module';
import { HomeComponent } from '@src/app/home/home.component';
import { ComponentsModule } from '@src/app/shared/components.module';
import { HeatmapChartComponent } from '@src/app/shared/graphs/echarts/heatmap-chart/heatmap-chart.component';
import { PipesModule } from '@src/app/shared/pipes.module';
import { LastUpdatedComponent } from '@src/app/shared/widgets/last-updated/last-updated.component';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    ReactiveFormsModule,
    HomeRoutingModule,
    FontAwesomeModule,
    ComponentsModule,
    CommonModule,
    RouterModule,
    PipesModule,
    FormsModule,
    MatGridListModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatTooltipModule,
    HeatmapChartComponent,
    LastUpdatedComponent,
    MatProgressSpinnerModule
  ]
})
export class HomeModule {}
