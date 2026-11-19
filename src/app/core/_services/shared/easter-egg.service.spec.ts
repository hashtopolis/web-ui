import { EasterEggService } from '@services/shared/easter-egg.service';

describe('EasterEggService', () => {
  let service: EasterEggService;

  const dispatchKey = (key: string): void => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key }));
  };

  const konamiCode = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'B',
    'A'
  ];

  beforeEach(() => {
    service = new EasterEggService();
  });

  afterEach(() => {
    service.ngOnDestroy();
  });

  it('emits when the complete Konami code is entered and allows it to be entered again', () => {
    const detected = vi.fn();
    service.onKonamiCodeDetected().subscribe(detected);

    konamiCode.forEach(dispatchKey);
    konamiCode.forEach(dispatchKey);

    expect(detected).toHaveBeenCalledTimes(2);
  });

  it('does not emit for an incomplete sequence', () => {
    const detected = vi.fn();
    service.onKonamiCodeDetected().subscribe(detected);

    ['ArrowUp', 'ArrowUp', 'ArrowDown'].forEach(dispatchKey);

    expect(detected).not.toHaveBeenCalled();
  });

  it('recognizes the code after discarding an unrelated older key', () => {
    const detected = vi.fn();
    service.onKonamiCodeDetected().subscribe(detected);

    dispatchKey('x');
    konamiCode.forEach(dispatchKey);

    expect(detected).toHaveBeenCalledExactlyOnceWith(undefined);
  });
});
