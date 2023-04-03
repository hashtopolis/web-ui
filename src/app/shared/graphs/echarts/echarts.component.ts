import {
  Component,
  AfterViewInit,
  DoCheck,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core'
import {EChartsOption, ECharts} from 'echarts'
import {fromEvent, Observable, Subscription} from 'rxjs'
import {debounceTime, switchMap} from 'rxjs/operators'
import {init} from 'echarts/lib/echarts'

@Component({
  selector: 'app-echarts',
  templateUrl: './echarts.component.html'
})
export class EchartsComponent {

  @Input() options: EChartsOption


}
