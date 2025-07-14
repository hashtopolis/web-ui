import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ComponentsModule } from '@src/app/shared/components.module';
import { HomeComponent } from '@src/app/home/home.component';
import { HomeRoutingModule } from '@src/app/home/home-routing.module';
import { PipesModule } from '@src/app/shared/pipes.module';
import { HeatmapChartComponent } from '@src/app/shared/graphs/echarts/heatmap-chart/heatmap-chart.component';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    ReactiveFormsModule,
    HomeRoutingModule,
    FontAwesomeModule,
    DataTablesModule,
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
    NgbModule,
    HeatmapChartComponent
  ]
})
export class HomeModule {}
