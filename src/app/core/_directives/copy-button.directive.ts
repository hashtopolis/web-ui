import {
  Directive,
  HostListener,
  Output,
  Input,
  EventEmitter
} from '@angular/core';

/**
 * Returns copied clipboard string
 * Usage:
 *   value | copyButton
 * Example:
 *     copyButton
 * @returns Copied String
**/

@Directive({
  selector: '[copyButton]'
})
export class CopyButtonDirective {

  @Input("copyButton")
  public payload: string;

  @Input()
  public context: string;

  @Output()
  public copied: EventEmitter<string> = new EventEmitter<string>();

  @HostListener("click", ["$event"])
  public onClick(event: MouseEvent): void {
    event.preventDefault();
    if (!this.payload)
      return;

    const listener = (e: ClipboardEvent) => {
      const clipboard = e.clipboardData || window["clipboardData"];
      clipboard.setData("text", this.payload.toString());
      e.preventDefault();
      this.copied.emit(this.payload);
    };

    document.addEventListener("copy", listener, false);
    document.execCommand("copy");
    document.removeEventListener("copy", listener, false);
  }


}
