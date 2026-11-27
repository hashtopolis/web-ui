import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { HorizontalNavComponent } from '@src/app/shared/navigation/horizontalnav.component';
import { HorizontalNavModule } from '@src/app/shared/navigation/navigation.module';

describe('HorizontalNavComponent', () => {
  let fixture: ComponentFixture<HorizontalNavComponent>;
  let component: HorizontalNavComponent;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorizontalNavModule],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(HorizontalNavComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('does not render a toggle group for an empty menu', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('mat-button-toggle-group')).toBeNull();
  });

  it('renders menu labels and marks the matching route active', () => {
    vi.spyOn(router, 'url', 'get').mockReturnValue('/tasks/42');
    fixture.componentRef.setInput('menuItems', [
      { label: 'Tasks', routeName: '/tasks' },
      { label: 'Agents', routeName: '/agents' }
    ]);
    fixture.detectChanges();

    const toggles = fixture.nativeElement.querySelectorAll('mat-button-toggle');
    expect(toggles.length).toBe(2);
    expect(toggles[0].textContent.trim()).toBe('Tasks');
    expect(toggles[1].textContent.trim()).toBe('Agents');
    expect(toggles[0].classList.contains('mat-button-toggle-checked')).toBe(true);
    expect(toggles[1].classList.contains('mat-button-toggle-checked')).toBe(false);
    expect(component.isActive('/tasks')).toBe(true);
    expect(component.isActive('/agents')).toBe(false);
  });

  it('navigates when a menu item is clicked', () => {
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.componentRef.setInput('menuItems', [{ label: 'Tasks', routeName: '/tasks' }]);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('mat-button-toggle').click();

    expect(navigate).toHaveBeenCalledExactlyOnceWith(['/tasks']);
  });

  it.each(['Enter', ' '])('navigates on %s keydown', (key: string) => {
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.componentRef.setInput('menuItems', [{ label: 'Agents', routeName: '/agents' }]);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('mat-button-toggle').dispatchEvent(new KeyboardEvent('keydown', { key }));

    expect(navigate).toHaveBeenCalledExactlyOnceWith(['/agents']);
  });

  it('ignores other keys', () => {
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    component.handleKeyDown(new KeyboardEvent('keydown', { key: 'Escape' }), '/agents');

    expect(navigate).not.toHaveBeenCalled();
  });
});
