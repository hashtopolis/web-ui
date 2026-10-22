import { Provider } from '@angular/core';
import { MATERIAL_ANIMATIONS } from '@angular/material/core';

/**
 * Turns off Angular Material's animations, so overlays and dialogs open and close synchronously in
 * a test. This is what NoopAnimationsModule did before @angular/animations was removed.
 */
export function provideDisabledMaterialAnimations(): Provider {
  return { provide: MATERIAL_ANIMATIONS, useValue: { animationsDisabled: true } };
}
