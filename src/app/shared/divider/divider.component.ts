import { Component, Input } from '@angular/core';

export const DividerVariant = {
  Faint: 'faint',
  Default: 'default',
  Strong: 'strong'
} as const;
export type DividerVariant = (typeof DividerVariant)[keyof typeof DividerVariant];

export const DividerOrientation = {
  Horizontal: 'horizontal',
  Vertical: 'vertical'
} as const;
export type DividerOrientation = (typeof DividerOrientation)[keyof typeof DividerOrientation];

@Component({
  selector: 'app-divider',
  template: '',
  styleUrls: ['./divider.component.scss'],
  standalone: false,
  host: {
    '[attr.data-variant]': 'variant',
    '[attr.data-orientation]': 'orientation',
    role: 'separator',
    '[attr.aria-orientation]': 'orientation'
  }
})
export class DividerComponent {
  @Input() variant: DividerVariant = DividerVariant.Faint;
  @Input() orientation: DividerOrientation = DividerOrientation.Horizontal;
}
