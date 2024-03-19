import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-preprocessors',
  templateUrl: './preprocessors.component.html'
})
export class PreprocessorsComponent {
  constructor(private titleService: AutoTitleService) {
    this.titleService.set(['Show Preprocessors']);
  }
}
