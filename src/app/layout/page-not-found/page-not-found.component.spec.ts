import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterLink, provideRouter } from '@angular/router';

import { PageNotFoundComponent } from '@src/app/layout/page-not-found/page-not-found.component';

@Component({
  selector: 'app-page-subtitle',
  template: '<p class="subtitle">{{ subtitle }}</p>',
  standalone: false
})
class StubPageSubtitleComponent {
  @Input() subtitle: string;
}

describe('PageNotFoundComponent', () => {
  let fixture: ComponentFixture<PageNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageNotFoundComponent, StubPageSubtitleComponent],
      imports: [RouterLink],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('renders the not-found heading and explanatory subtitle', () => {
    fixture = TestBed.createComponent(PageNotFoundComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('h3')?.textContent?.trim()).toBe('Oops! Page not found');
    expect(element.querySelector('h1')?.textContent?.replace(/\s/g, '')).toBe('404');
    expect(element.querySelector('.subtitle')?.textContent?.trim()).toBe(
      'we are sorry, but the page you requested was not found'
    );
  });

  it('links back to the homepage', () => {
    fixture = TestBed.createComponent(PageNotFoundComponent);
    fixture.detectChanges();

    const link = fixture.debugElement.query(By.directive(RouterLink)).injector.get(RouterLink);
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(button.textContent?.trim()).toBe('Back to homepage');
    expect(link.urlTree?.toString()).toBe('/');
  });
});
