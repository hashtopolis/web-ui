import { AutoTitleService } from '@services/shared/autotitle.service';

import { AppModule } from '@src/app/app.module';

export function PageTitle(title: string | string[]): ClassDecorator {
  return function (constructor: any) {
    const originalNgOnInit = constructor.prototype.ngOnInit;

    constructor.prototype.ngOnInit = function () {
      if (!this.__titleService) {
        // Lazy get the service only once per instance
        this.__titleService = AppModule.injector.get(AutoTitleService);
      }
      if (originalNgOnInit) {
        originalNgOnInit.apply(this);
      }

      this.__titleService.set(title);
    };
  };
}
