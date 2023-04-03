import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { DOCUMENT } from '@angular/common';

@Component({
    selector: 'app-scroll-top',
    templateUrl: './scrollytop.component.html'
})

export class ScrollYTopComponent implements OnInit {

    windowScrolled: boolean;
    faChevronUp=faChevronUp;

    constructor(
      @Inject(DOCUMENT) private document: Document
      ) {}

    @HostListener("window:scroll", [])

    onWindowScroll() {
        if (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop > 100) {
            this.windowScrolled = true;
        }
       else if (this.windowScrolled && window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop < 10) {
            this.windowScrolled = false;
        }
    }

    scrollToTop() {
        (function smoothscroll() {
            var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
            if (currentScroll > 0) {
                window.requestAnimationFrame(smoothscroll);
                scrollBy(0, 5);
                window.scrollTo(0, currentScroll - (currentScroll / 8));
            }
        })();
    }

    ngOnInit() {}

}
