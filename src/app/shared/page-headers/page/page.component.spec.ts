import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

import { PageComponent } from '@src/app/shared/page-headers/page/page.component';

describe('PageComponent', () => {
  let fixture: ComponentFixture<PageComponent>;
  let navigate: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    navigate = vi.fn().mockName('Router.navigate').mockResolvedValue(true);

    await TestBed.configureTestingModule({
      declarations: [PageComponent],
      imports: [MatButtonModule, MatIconModule],
      providers: [{ provide: Router, useValue: { navigate } }]
    }).compileComponents();

    fixture = TestBed.createComponent(PageComponent);
    fixture.componentRef.setInput('title', 'Tasks');
  });

  it('should display the title and subtitle', () => {
    fixture.componentRef.setInput('subtitle', 'Manage tasks');

    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('h1')?.textContent?.trim()).toBe('Tasks');
    expect(element.querySelector('p')?.textContent?.trim()).toBe('Manage tasks');
  });

  it.each([undefined, ''])('should hide a missing or empty subtitle: %s', (subtitle) => {
    fixture.componentRef.setInput('subtitle', subtitle);

    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('p')).toBeNull();
  });

  it.each([undefined, false])('should hide the action when it is not enabled: %s', (showAction) => {
    fixture.componentRef.setInput('showAction', showAction);
    fixture.componentRef.setInput('actionTitle', 'Create task');

    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('button')).toBeNull();
  });

  it.each([undefined, ''])('should hide the action when its title is missing or empty: %s', (actionTitle) => {
    fixture.componentRef.setInput('showAction', true);
    fixture.componentRef.setInput('actionTitle', actionTitle);

    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('button')).toBeNull();
  });

  it('should navigate to the action link when the action is clicked', () => {
    fixture.componentRef.setInput('showAction', true);
    fixture.componentRef.setInput('actionTitle', 'Create task');
    fixture.componentRef.setInput('actionLink', '/tasks/new');
    fixture.detectChanges();
    const button = (fixture.nativeElement as HTMLElement).querySelector('button')!;

    button.click();

    expect(button.textContent?.trim()).toContain('Create task');
    expect(navigate).toHaveBeenCalledExactlyOnceWith(['/tasks/new']);
  });

  it.each([undefined, ''])('should not navigate when the action link is missing or empty: %s', (actionLink) => {
    fixture.componentRef.setInput('showAction', true);
    fixture.componentRef.setInput('actionTitle', 'Create task');
    fixture.componentRef.setInput('actionLink', actionLink);
    fixture.detectChanges();
    const button = (fixture.nativeElement as HTMLElement).querySelector('button')!;

    button.click();

    expect(navigate).not.toHaveBeenCalled();
  });
});
