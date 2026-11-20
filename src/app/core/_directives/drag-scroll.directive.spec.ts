import { Component, Input } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { DragScrollDirective } from '@src/app/core/_directives/drag-scroll.directive';

@Component({
  imports: [DragScrollDirective],
  template: `<div appDragScroll [appDragScrollThreshold]="threshold">
    <a href="#">link</a><input /><textarea></textarea
    ><select></select
    ><span contenteditable="true"><b>text</b></span>
  </div>`
})
class TestHostComponent {
  @Input() threshold = 5;
}

describe('DragScrollDirective', () => {
  function setup() {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement.querySelector('div');
    Object.defineProperties(element, {
      scrollWidth: { configurable: true, value: 200 },
      clientWidth: { configurable: true, value: 100 }
    });
    return { fixture, element };
  }

  function mouse(target: EventTarget, type: string, x = 0, button = 0) {
    const event = new MouseEvent(type, { bubbles: true, cancelable: true, clientX: x, button });
    target.dispatchEvent(event);
    return event;
  }

  beforeEach(() => TestBed.configureTestingModule({ imports: [TestHostComponent] }));

  it('scrolls at the threshold, clears selection and suppresses only the trailing click', () => {
    const { fixture, element } = setup();
    const link = element.querySelector('a')!;
    const click = vi.fn().mockName('click');
    link.addEventListener('click', click);
    const selection = window.getSelection()!;
    const clear = vi.spyOn(selection, 'removeAllRanges').mockImplementation(() => {});
    element.scrollLeft = 30;
    mouse(link, 'mousedown', 20);
    expect(mouse(link, 'dragstart').defaultPrevented).toBe(true);
    expect(mouse(window, 'mousemove', 24).defaultPrevented).toBe(false);
    expect(element.scrollLeft).toBe(30);
    expect(element.classList.contains('app-drag-scroll-dragging')).toBe(false);
    expect(mouse(window, 'mousemove', 25).defaultPrevented).toBe(true);
    expect(element.scrollLeft).toBe(25);
    expect(element.classList.contains('app-drag-scroll-dragging')).toBe(true);
    expect(clear).toHaveBeenCalledTimes(1);
    mouse(window, 'mouseup');
    expect(element.classList.contains('app-drag-scroll-dragging')).toBe(false);
    expect(mouse(link, 'click').defaultPrevented).toBe(true);
    expect(click).not.toHaveBeenCalled();
    expect(mouse(link, 'click').defaultPrevented).toBe(false);
    expect(click).toHaveBeenCalledTimes(1);
    fixture.destroy();
  });

  it('preserves clicks below a custom threshold and resets suppression on a new press', () => {
    const { fixture, element } = setup();
    fixture.componentRef.setInput('threshold', 10);
    fixture.detectChanges();
    mouse(element, 'mousedown', 20);
    mouse(window, 'mousemove', 29);
    mouse(window, 'mouseup');
    expect(mouse(element, 'click').defaultPrevented).toBe(false);
    mouse(element, 'mousedown', 20);
    mouse(window, 'mousemove', 10);
    expect(element.scrollLeft).toBe(10);
    mouse(window, 'mouseup');
    mouse(element, 'mousedown', 20);
    mouse(window, 'mouseup');
    expect(mouse(element, 'click').defaultPrevented).toBe(false);
    fixture.destroy();
  });

  it('ignores non-primary presses, non-overflowing hosts and editable targets', () => {
    const { fixture, element } = setup();
    const targets = ['input', 'textarea', 'select', 'b'];
    for (const selector of targets) {
      mouse(element.querySelector(selector)!, 'mousedown', 20);
      expect(mouse(element, 'dragstart').defaultPrevented).toBe(false);
      mouse(window, 'mousemove', 40);
      expect(element.scrollLeft).toBe(0);
    }
    mouse(element, 'mousedown', 20, 2);
    mouse(window, 'mousemove', 40);
    expect(element.scrollLeft).toBe(0);
    Object.defineProperty(element, 'scrollWidth', { configurable: true, value: 101 });
    mouse(element, 'mousedown', 20);
    mouse(window, 'mousemove', 40);
    expect(element.scrollLeft).toBe(0);
    fixture.destroy();
  });

  it('removes window and capture listeners on destruction', () => {
    const { fixture, element } = setup();
    mouse(element, 'mousedown', 20);
    mouse(window, 'mousemove', 30);
    fixture.destroy();
    mouse(window, 'mousemove', 50);
    expect(element.scrollLeft).toBe(-10);
    expect(mouse(element, 'click').defaultPrevented).toBe(false);
  });
});
