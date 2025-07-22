import { CommonModule } from '@angular/common';
import { CopyButtonDirective } from '../core/_directives/copy-button.directive';
import { FileDropDirective } from '../core/_directives/file-drop.directive';
import { FileSelectDirective } from '../core/_directives/file-select.directive';
import { HoverDashedDirective } from '../core/_directives/hover-dashed.directive';
import { LoadingButtonDirective } from '@src/app/core/_directives/loading-button.directive';
import { NgModule } from '@angular/core';
import { StartsWithActiveDirective } from '../core/_directives/nav-startswith.directive';
import { UnderlineDirective } from '../core/_directives/underline.directive';

@NgModule({
  declarations: [
    StartsWithActiveDirective,
    HoverDashedDirective,
    FileSelectDirective,
    CopyButtonDirective,
    UnderlineDirective,
    FileDropDirective,
    LoadingButtonDirective
  ],
  imports: [CommonModule],
  exports: [
    StartsWithActiveDirective,
    HoverDashedDirective,
    FileSelectDirective,
    CopyButtonDirective,
    UnderlineDirective,
    FileDropDirective,
    LoadingButtonDirective
  ]
})
export class DirectivesModule {}
