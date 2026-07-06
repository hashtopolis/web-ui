import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';

import { UIConfigService } from '@services/shared/storage.service';

@Component({
  selector: 'blacklist-attack',
  templateUrl: './blacklisted-attack.component.html',
  styleUrls: ['./blacklisted-attack.component.scss'],
  standalone: false
})
export class BlacklistAttackComponent implements OnChanges {
  @Input() value: string = '';

  hasErrors = false;
  blacklistedChars: string[] = [];

  private uiService = inject(UIConfigService);

  ngOnChanges(changes: SimpleChanges): void {
    if ('value' in changes) {
      this.checkForBanChars();
    }
  }

  /**
   * Safely escapes all special regex characters from the config string
   */
  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\-]/g, '\\$&');
  }

  checkForBanChars(): void {
    const rawConfigChars = this.uiService.getUISettings()?.blacklistChars ?? '';
    const inputValue = this.value || '';

    // Reset state early
    this.blacklistedChars = [];
    this.hasErrors = false;

    // Short-circuit if there's nothing to check or input is empty
    if (!rawConfigChars || !inputValue) {
      return;
    }

    const escapedChars = this.escapeRegex(rawConfigChars);
    const banCharsRegex = new RegExp('[' + escapedChars + ']', 'g');

    const matches = inputValue.match(banCharsRegex);
    if (matches) {
      this.hasErrors = true;
      this.blacklistedChars = [...new Set(matches)];
    }
  }
}
