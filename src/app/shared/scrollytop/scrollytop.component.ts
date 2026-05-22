import { faChevronUp } from '@fortawesome/free-solid-svg-icons';

import { Component, DOCUMENT, HostListener, inject } from '@angular/core';

@Component({
  selector: 'app-scroll-top',
  templateUrl: './scrollytop.component.html',
  styleUrls: ['./scrollytop.component.scss'],
  standalone: false
})
export class ScrollYTopComponent {
  private document = inject<Document>(DOCUMENT);

  windowScrolled: boolean;
  faChevronUp = faChevronUp;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (window.scrollY || document.documentElement.scrollTop || document.body.scrollTop > 100) {
      this.windowScrolled = true;
    } else if (
      (this.windowScrolled && window.scrollY) ||
      document.documentElement.scrollTop ||
      document.body.scrollTop < 10
    ) {
      this.windowScrolled = false;
    }
  }

  scrollToTop() {
    (function smoothscroll() {
      const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
      if (currentScroll > 0) {
        window.requestAnimationFrame(smoothscroll);
        scrollBy(0, 5);
        window.scrollTo(0, currentScroll - currentScroll / 8);
      }
    })();
  }
}
