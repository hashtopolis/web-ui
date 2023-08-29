import { AutoTitleService } from "../_services/shared/autotitle.service";
import { AppModule } from "src/app/app.module";

export function PageTitle(title: string | string[]): ClassDecorator {

   return function (constructor: any){
    const titleService = AppModule.injector.get(AutoTitleService);

    const ngOnInit = constructor.prototype.ngOnInit;

    constructor.prototype.ngOnInit = function () {
      ngOnInit && ngOnInit.apply(this);
      titleService.set(title)
    }
   }

}
