import {
  Directive,
  HostListener,
  Renderer2,
  ElementRef
} from '@angular/core';

/*
 * Hover Dashed Directive
 *
*/

@Directive({
  selector: '[hoverDashed]'
})

export class HoverDashedDirective {
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
    this.renderer.setStyle(this.el.nativeElement, 'border', "1px dashed #999");
    } else {
    this.renderer.removeStyle(this.el.nativeElement, 'border');
    }
  }

}
