import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { PageSubTitleComponent } from '@src/app/shared/page-headers/page-subtitle/page-subtitle.component';

describe('PageSubTitleComponent', () => {
  let fixture: ComponentFixture<PageSubTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageSubTitleComponent],
      imports: [MatButtonModule, MatIconModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PageSubTitleComponent);
  });

  it('should display the subtitle without an action when no action title is provided', () => {
    fixture.componentRef.setInput('subtitle', 'Details');
    fixture.componentRef.setInput('actionIcon', 'edit');

    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('h3')?.textContent?.trim()).toBe('Details');
    expect(element.querySelector('button')).toBeNull();
  });

  it('should display an empty subtitle and hide an empty action title', () => {
    fixture.componentRef.setInput('subtitle', '');
    fixture.componentRef.setInput('actionTitle', '');

    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('h3')?.textContent?.trim()).toBe('');
    expect(element.querySelector('button')).toBeNull();
  });

  it('should display the action without an icon when no icon is provided', () => {
    fixture.componentRef.setInput('actionTitle', 'Edit');

    fixture.detectChanges();

    const button = (fixture.nativeElement as HTMLElement).querySelector('button');
    expect(button?.textContent?.trim()).toBe('Edit');
    expect(button?.querySelector('mat-icon')).toBeNull();
  });

  it('should display the action icon and emit once when the action is clicked', () => {
    const actionClicked = vi.fn().mockName('actionClicked');
    fixture.componentInstance.actionClicked.subscribe(actionClicked);
    fixture.componentRef.setInput('actionTitle', 'Edit');
    fixture.componentRef.setInput('actionIcon', 'edit');
    fixture.detectChanges();
    const button = (fixture.nativeElement as HTMLElement).querySelector('button')!;

    button.click();

    expect(button.querySelector('mat-icon')?.textContent?.trim()).toBe('edit');
    expect(actionClicked).toHaveBeenCalledExactlyOnceWith(undefined);
  });
});
