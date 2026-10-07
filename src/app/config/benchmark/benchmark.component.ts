import { AutoTitleService } from 'src/app/core/_services/shared/autotitle.service';

import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-benchmark',
  templateUrl: './benchmark.component.html',
  standalone: false
})
export class BenchmarkComponent {
  private titleService = inject(AutoTitleService);

  constructor() {
    this.titleService.set(['Benchmark Cache']);
  }
}
