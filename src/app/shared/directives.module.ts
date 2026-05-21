import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CopyButtonDirective } from '@src/app/core/_directives/copy-button.directive';
import { FileDropDirective } from '@src/app/core/_directives/file-drop.directive';
import { FileSelectDirective } from '@src/app/core/_directives/file-select.directive';
import { HoverDashedDirective } from '@src/app/core/_directives/hover-dashed.directive';
import { StartsWithActiveDirective } from '@src/app/core/_directives/nav-startswith.directive';
import { UnderlineDirective } from '@src/app/core/_directives/underline.directive';

@NgModule({
  declarations: [
    StartsWithActiveDirective,
    HoverDashedDirective,
    FileSelectDirective,
    CopyButtonDirective,
    UnderlineDirective,
    FileDropDirective
  ],
  imports: [CommonModule],
  exports: [
    StartsWithActiveDirective,
    HoverDashedDirective,
    FileSelectDirective,
    CopyButtonDirective,
    UnderlineDirective,
    FileDropDirective
  ]
})
export class DirectivesModule {}
