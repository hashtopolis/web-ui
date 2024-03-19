import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgModule } from '@angular/core';
import { PageSubTitleComponent } from './page-subtitle/page-subtitle.component';
import { PageTitleComponent } from './page-title/page-title.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    FontAwesomeModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [PageTitleComponent, PageSubTitleComponent],
  declarations: [PageTitleComponent, PageSubTitleComponent]
})
export class PageTitleModule {}
