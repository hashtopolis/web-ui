import { Component, OnInit, Inject, HostListener, DOCUMENT } from '@angular/core';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';


@Component({
    selector: 'app-scroll-top',
    templateUrl: './scrollytop.component.html',
    standalone: false
})

export class ScrollYTopComponent {

    windowScrolled: boolean;
    faChevronUp=faChevronUp;

    constructor(
      @Inject(DOCUMENT) private document: Document
      ) {}

    @HostListener("window:scroll", [])

    onWindowScroll() {
        if (window.scrollY || document.documentElement.scrollTop || document.body.scrollTop > 100) {
            this.windowScrolled = true;
        }
       else if (this.windowScrolled && window.scrollY || document.documentElement.scrollTop || document.body.scrollTop < 10) {
            this.windowScrolled = false;
        }
    }

    scrollToTop() {
        (function smoothscroll() {
            const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
            if (currentScroll > 0) {
                window.requestAnimationFrame(smoothscroll);
                scrollBy(0, 5);
                window.scrollTo(0, currentScroll - (currentScroll / 8));
            }
        })();
    }

}
