import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { SelectizeDirective } from "../core/_directives/selectize.directive";
import { FileSelectDirective } from "../core/_directives/file-select.directive";
import { FileDropDirective } from "../core/_directives/file-drop.directive";
import { CopyButtonDirective } from "../core/_directives/copy-button.directive";

@NgModule({
  declarations: [
    SelectizeDirective,
    FileSelectDirective,
    FileDropDirective,
    CopyButtonDirective
  ],
  imports: [CommonModule],
  exports: [
    SelectizeDirective,
    FileSelectDirective,
    FileDropDirective,
    CopyButtonDirective
  ]
})
export class DirectivesModule {}




