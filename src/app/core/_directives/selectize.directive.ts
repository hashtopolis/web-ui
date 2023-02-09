import {
  Directive,
  ElementRef,
  OnInit } from "@angular/core";

@Directive({
  selector: '[appSelectize]'
})
export class SelectizeDirective implements OnInit{
  constructor(private elementRef: ElementRef){}

  ngOnInit(): void {

  }
}
