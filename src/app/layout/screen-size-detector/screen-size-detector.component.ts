import { SCREEN_SIZE } from "src/app/layout/screen-size-detector/screen-size-detector.enum";
import { ScreenSizeService } from 'src/app/core/_services/shared/screensize.service';
import { AfterViewInit, Component, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-screen-size-detector',
  templateUrl: './screen-size-detector.component.html'
})
export class ScreenSizeDetectorComponent implements AfterViewInit {

  prefix = 'is-';
  sizes = [
    {
      id: SCREEN_SIZE.XS, name: 'xs',
      css: `d-block d-sm-none`
    },
    {
      id: SCREEN_SIZE.SM, name: 'sm',
      css: `d-none d-sm-block d-md-none`
    },
    {
      id: SCREEN_SIZE.MD, name: 'md',
      css: `d-none d-md-block d-lg-none`
    },
    {
      id: SCREEN_SIZE.LG, name: 'lg',
      css: `d-none d-lg-block d-xl-none`
    },
    {
      id: SCREEN_SIZE.XL, name: 'xl',
      css: `d-none d-xl-block`
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
