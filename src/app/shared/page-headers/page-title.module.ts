import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { PageComponent } from '@src/app/shared/page-headers/page/page.component';
import { PageSubTitleComponent } from '@src/app/shared/page-headers/page-subtitle/page-subtitle.component';

@NgModule({
  imports: [FormsModule, CommonModule, FontAwesomeModule, MatCardModule, MatButtonModule, MatIconModule],
  exports: [PageSubTitleComponent, PageComponent],
  declarations: [PageSubTitleComponent, PageComponent]
})
export class PageTitleModule {}
