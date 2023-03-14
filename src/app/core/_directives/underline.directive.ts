import {
  Directive,
  HostListener,
  Renderer2,
  ElementRef
} from '@angular/core';

/*
 * Underline Directive
 *
*/

@Directive({
  selector: '[underline]'
})

export class UnderlineDirective {
  constructor(
    private renderer: Renderer2,
    private el: ElementRef
){}

@HostListener('mouseenter') Enter() {
    this.hover(true);
 }

@HostListener('mouseleave') Leave() {
    this.hover(false);
 }

hover(shouldUnderline: boolean){
    if(shouldUnderline){
    this.renderer.setStyle(this.el.nativeElement, 'text-decoration', 'underline');
    } else {
    this.renderer.setStyle(this.el.nativeElement, 'text-decoration', 'none');
    }
  }

}
