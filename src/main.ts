// side effect imports, replace window.localStorage and window.sessionStorage with
// the typed LocalStorage wrapper and augment the global type.
// Must run before any other code accesses localStorage or sessionStorage.
import '@src/app/core/_services/storage/local-storage';
import '@src/app/core/_services/storage/session-storage';

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from '@src/app/app.module';
import { registerEChartsModules } from '@src/app/shared/graphs/echarts/echarts.config';
import { environment } from '@src/environments/environment';

if (environment.production) {
  enableProdMode();
}

registerEChartsModules();

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then((ref) => {
    // Ensure Angular destroys itself on hot reloads.
    if (window['ngRef']) {
      window['ngRef'].destroy();
    }
    window['ngRef'] = ref;

    // Otherwise, log the boot error
  })
  .catch((err) => console.error(err));
