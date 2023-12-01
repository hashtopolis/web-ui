import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { UIConfigService } from 'src/app/core/_services/shared/storage.service';

@Component({
  selector: 'blacklist-attack',
  templateUrl: './blacklisted-attack.component.html'
})
export class BlacklistAttackComponent implements OnChanges {
  @Input() value: any;

  hasErrors = false;
  blacklistedChars: string[] = [];

  constructor(private uiService: UIConfigService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('value' in changes) {
      this.checkForBanChars();
    }
  }

  /**
   * Gets a regular expression pattern for matching blacklisted characters.
   * The pattern is constructed based on the blacklisted characters retrieved from the UI settings.
   * @returns {RegExp} A regular expression for matching blacklisted characters.
   */
  getBanChars() {
    const chars = this.uiService
      .getUIsettings('blacklistChars')
      .value.replace(']', '\\]')
      .replace('[', '\\[');
    return new RegExp('[' + chars + '/]', 'g');
  }

  /**
   * Checks if the input value contains blacklisted characters.
   * If blacklisted characters are present, sets hasErrors to true
   * and populates the blacklistedChars array with the detected characters.
   * @returns void
   */
  checkForBanChars() {
    const banCharsRegex = this.getBanChars();
    const inputValue = this.value || ''; // Ensure a default value if value is null or undefined

    this.blacklistedChars = []; // Reset the array

    if (banCharsRegex.test(inputValue)) {
      // Ban characters are present
      this.hasErrors = true;

      // Extract blacklisted characters and populate blacklistedChars array
      const matches = inputValue.match(banCharsRegex) as string[];
      if (matches) {
        this.blacklistedChars = [...new Set(matches)]; // Remove duplicates
        console.log('Blacklisted characters:', this.blacklistedChars);
      }
    } else {
      // No ban characters
      this.hasErrors = false;
    }
  }
}
