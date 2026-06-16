import { Component, Input, OnChanges } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';

interface Cell {
  date: string;
  value: number;
  week: number;
  day: number;
}

const BUCKET_ALPHAS = [0.18, 0.32, 0.55, 0.85];

@Component({
  selector: 'app-heatmap-chart',
  standalone: true,
  imports: [MatTooltipModule],
  template: `
    <div class="heatmap" [style.--heatmap-week-count]="weeks.length">
      <div class="heatmap__grid">
        <div class="heatmap__months-spacer"></div>
        <div class="heatmap__months">
          @for (week of weeks; track $index; let wi = $index) {
            <div class="heatmap__month-slot">{{ monthLabelForWeek(wi) }}</div>
          }
        </div>
        <div class="heatmap__day-labels">
          @for (label of dayLabels; track $index) {
            <div class="heatmap__day-label">{{ label }}</div>
          }
        </div>
        <div class="heatmap__weeks">
          @for (week of weeks; track $index; let wi = $index) {
            <div class="heatmap__week">
              @for (day of days; track $index; let di = $index) {
                <div
                  class="heatmap__cell"
                  [style.background]="cellColor(cellAt(wi, di))"
                  [matTooltip]="cellTitle(cellAt(wi, di))"
                  matTooltipPosition="above"
                  matTooltipShowDelay="0"
                  matTooltipHideDelay="0"
                  matTooltipClass="tooltip-custom-style"
                ></div>
              }
            </div>
          }
        </div>
      </div>
      @if (showLegend) {
        <div class="heatmap__legend">
          <span class="heatmap__legend-label">Less</span>
          @for (alpha of legendAlphas; track $index) {
            <div class="heatmap__legend-swatch" [style.background]="alphaColor(alpha)"></div>
          }
          <span class="heatmap__legend-label">More</span>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .heatmap {
        --heatmap-week-count: 52;
        width: 100%;
        padding: 4px 0;
      }
      .heatmap__grid {
        display: grid;
        grid-template-columns: auto 1fr;
        grid-template-rows: auto auto;
        column-gap: 6px;
        row-gap: 4px;
      }
      .heatmap__months-spacer {
        grid-column: 1;
        grid-row: 1;
      }
      .heatmap__months {
        grid-column: 2;
        grid-row: 1;
        display: grid;
        grid-template-columns: repeat(var(--heatmap-week-count), 1fr);
        gap: 3px;
        min-width: 0;
      }
      .heatmap__month-slot {
        height: 12px;
        font-size: 10px;
        line-height: 1;
        color: var(--subtle-foreground);
        letter-spacing: 0.04em;
        text-transform: uppercase;
        white-space: nowrap;
        overflow: visible;
      }
      .heatmap__day-labels {
        grid-column: 1;
        grid-row: 2;
        display: grid;
        grid-template-rows: repeat(7, 1fr);
        gap: 3px;
      }
      .heatmap__day-label {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        font-size: 9px;
        line-height: 1;
        color: var(--subtle-foreground);
      }
      .heatmap__weeks {
        grid-column: 2;
        grid-row: 2;
        display: grid;
        grid-template-columns: repeat(var(--heatmap-week-count), 1fr);
        gap: 3px;
        min-width: 0;
      }
      .heatmap__week {
        display: grid;
        grid-template-rows: repeat(7, 1fr);
        gap: 3px;
        min-width: 0;
      }
      .heatmap__cell {
        aspect-ratio: 1 / 1;
        border-radius: 2px;
        transition: transform 0.12s ease;
      }
      .heatmap__cell:hover {
        transform: scale(1.15);
      }
      .heatmap__legend {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-top: 10px;
        justify-content: flex-end;
      }
      .heatmap__legend-label {
        font-size: 10px;
        color: var(--subtle-foreground);
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }
      .heatmap__legend-swatch {
        width: 10px;
        height: 10px;
        border-radius: 2px;
      }
    `
  ]
})
export class HeatmapChartComponent implements OnChanges {
  @Input() data: [string, number][] = [];
  @Input() isDarkMode = false;
  /** When false, hides the embedded Less/More legend so a parent can render its own. */
  @Input() showLegend = true;
  /** Number of week columns to render. 52 ≈ 12 months. */
  @Input() weekCount = 52;

  weeks: number[] = Array.from({ length: 52 }, (_, i) => i);
  readonly days = Array.from({ length: 7 }, (_, i) => i);
  readonly dayLabels = ['Mon', '', 'Wed', '', 'Fri', '', 'Sun'];
  readonly legendAlphas = BUCKET_ALPHAS;

  private readonly monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  private cells: Cell[] = [];
  private monthLabelByWeek: string[] = [];
  private maxValue = 0;

  ngOnChanges(): void {
    this.weeks = Array.from({ length: this.weekCount }, (_, i) => i);
    this.rebuildCells();
  }

  cellAt(week: number, day: number): Cell | undefined {
    return this.cells[week * this.days.length + day];
  }

  cellTitle(cell: Cell | undefined): string {
    if (!cell) return '';
    const count = cell.value;
    if (count === 0) return `${cell.date} — no cracks`;
    return `${cell.date} — ${count} crack${count === 1 ? '' : 's'}`;
  }

  monthLabelForWeek(week: number): string {
    return this.monthLabelByWeek[week] ?? '';
  }

  private monthFromDate(dateStr: string): number {
    return Number(dateStr.split('-')[1]) - 1;
  }

  /**
   * Cell color is bucketed against the dataset's max value into 4 quartiles
   * (plus an empty bucket for value 0). Buckets keep cells in the same
   * fixed alpha steps as the legend so the two read consistently.
   */
  cellColor(cell: Cell | undefined): string {
    const value = cell?.value ?? 0;
    if (value === 0 || this.maxValue === 0) return 'var(--well)';
    const ratio = value / this.maxValue;
    const idx = ratio <= 0.25 ? 0 : ratio <= 0.5 ? 1 : ratio <= 0.75 ? 2 : 3;
    return this.alphaColor(BUCKET_ALPHAS[idx]);
  }

  alphaColor(alpha: number): string {
    return `color-mix(in oklch, var(--primary) ${Math.round(alpha * 100)}%, transparent)`;
  }

  private rebuildCells(): void {
    const counts = new Map<string, number>();
    for (const [date, n] of this.data) {
      counts.set(date, (counts.get(date) ?? 0) + n);
    }

    const totalCells = this.weeks.length * this.days.length;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const cells: Cell[] = [];
    let maxValue = 0;

    for (let i = 0; i < totalCells; i++) {
      const offsetFromEnd = totalCells - 1 - i;
      const cellDate = new Date(today);
      cellDate.setDate(today.getDate() - offsetFromEnd);
      const key = this.formatDate(cellDate);
      const value = counts.get(key) ?? 0;
      if (value > maxValue) maxValue = value;

      cells.push({
        date: key,
        value,
        week: Math.floor(i / this.days.length),
        day: i % this.days.length
      });
    }

    this.cells = cells;
    this.maxValue = maxValue;
    this.monthLabelByWeek = this.buildMonthLabels(cells);
  }

  private buildMonthLabels(cells: Cell[]): string[] {
    const labels: string[] = [];
    let prevMonth = -1;
    for (let week = 0; week < this.weeks.length; week++) {
      const first = cells[week * this.days.length];
      if (!first) {
        labels.push('');
        continue;
      }
      const month = this.monthFromDate(first.date);
      labels.push(month !== prevMonth ? this.monthNames[month] : '');
      prevMonth = month;
    }
    return labels;
  }

  private formatDate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
}
