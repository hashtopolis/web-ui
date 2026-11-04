import { of } from 'rxjs';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Data } from '@angular/router';

import { ErrorPageComponent } from '@src/app/layout/error-page/error-page.component';

describe('ErrorPageComponent', () => {
  let fixture: ComponentFixture<ErrorPageComponent>;
  const errData: Data = { message: 'test' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ErrorPageComponent],
      providers: [{ provide: ActivatedRoute, useValue: { data: of(errData) } }]
    }).compileComponents();
  });

  it('renders the header element with error message from route data', () => {
    fixture = TestBed.createComponent(ErrorPageComponent);
    fixture.detectChanges();
    const heading = fixture.debugElement.query(By.css('h4')).nativeElement as HTMLHeadingElement;

    expect(heading.textContent).toContain('test');
  });
});
