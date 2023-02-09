import {
  Directive,
  HostListener,
  HostBinding,
  Output,
  Input,
  EventEmitter
} from '@angular/core';

/*
 * Copy string to clipboard
 * Usage:
 *   value | copyButton
 * Example:
 *     copyButton
 *
*/

@Directive({
  selector: '[copyButton]'
})
export class CopyButtonDirective {

  @Input("copyButton")
  public payload: string;

  @Input("context")
  public context: string;

  @Output("copied")
  public copied: EventEmitter<string> = new EventEmitter<string>();

  @HostListener("click", ["$event"])
  public onClick(event: MouseEvent): void {
    event.preventDefault();
    if (!this.payload)
      return;

    let listener = (e: ClipboardEvent) => {
      let clipboard = e.clipboardData || window["clipboardData"];
      clipboard.setData("text", this.payload.toString());
      e.preventDefault();
      this.copied.emit(this.payload);
    };

    document.addEventListener("copy", listener, false);
    document.execCommand("copy");
    document.removeEventListener("copy", listener, false);
  }


}
