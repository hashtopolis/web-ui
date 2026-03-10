import { SCREEN_SIZE } from "src/app/layout/screen-size-detector/screen-size-detector.enum";
import { ScreenSizeService } from 'src/app/core/_services/shared/screensize.service';
import { AfterViewInit, Component, ElementRef, HostListener } from '@angular/core';

@Component({
    selector: 'app-screen-size-detector',
    templateUrl: './screen-size-detector.component.html',
    standalone: false
})
export class ScreenSizeDetectorComponent implements AfterViewInit {

  prefix = 'is-';
  sizes = [
    {
      id: SCREEN_SIZE.XS, name: 'xs',
      css: `block sm:hidden`
    },
    {
      id: SCREEN_SIZE.SM, name: 'sm',
      css: `hidden sm:block md:hidden`
    },
    {
      id: SCREEN_SIZE.MD, name: 'md',
      css: `hidden md:block lg:hidden`
    },
    {
      id: SCREEN_SIZE.LG, name: 'lg',
      css: `hidden lg:block xl:hidden`
    },
    {
      id: SCREEN_SIZE.XL, name: 'xl',
      css: `hidden xl:block`
    },
  ];

  constructor(
    private elementRef: ElementRef,
    private resizeSvc: ScreenSizeService
  ) { }

  @HostListener("window:resize", [])
  private onResize() {
    this.detectScreenSize();
  }

  ngAfterViewInit() {
    this.detectScreenSize();
  }

  private detectScreenSize() {
    const currentSize = this.sizes.find(x => {
      const el = this.elementRef.nativeElement.querySelector(`.${this.prefix}${x.id}`);
      const isVisible = window.getComputedStyle(el).display != 'none';

      return isVisible;
    });

    this.resizeSvc.onResize(currentSize.id);
  }
}
