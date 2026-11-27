import { TestBed } from '@angular/core/testing';

import { DividerComponent, DividerOrientation, DividerVariant } from '@src/app/shared/divider/divider.component';

describe('DividerComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ declarations: [DividerComponent] });
  });

  it('renders a faint horizontal separator by default', () => {
    const fixture = TestBed.createComponent(DividerComponent);
    fixture.detectChanges();
    const host: HTMLElement = fixture.nativeElement;

    expect(host.getAttribute('role')).toBe('separator');
    expect(host.getAttribute('data-variant')).toBe(DividerVariant.Faint);
    expect(host.getAttribute('data-orientation')).toBe(DividerOrientation.Horizontal);
    expect(host.getAttribute('aria-orientation')).toBe(DividerOrientation.Horizontal);
  });

  it.each([DividerVariant.Faint, DividerVariant.Default, DividerVariant.Strong])(
    'updates variant to %s',
    (variant: DividerVariant) => {
      const fixture = TestBed.createComponent(DividerComponent);
      fixture.componentRef.setInput('variant', variant);
      fixture.detectChanges();

      expect(fixture.nativeElement.getAttribute('data-variant')).toBe(variant);
    }
  );

  it.each([DividerOrientation.Horizontal, DividerOrientation.Vertical])(
    'updates orientation to %s',
    (orientation: DividerOrientation) => {
      const fixture = TestBed.createComponent(DividerComponent);
      fixture.componentRef.setInput('orientation', orientation);
      fixture.detectChanges();

      expect(fixture.nativeElement.getAttribute('data-orientation')).toBe(orientation);
      expect(fixture.nativeElement.getAttribute('aria-orientation')).toBe(orientation);
    }
  );
});
