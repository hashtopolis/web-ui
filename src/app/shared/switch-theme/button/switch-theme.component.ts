import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { ThemeService } from 'src/app/core/_services/shared/theme.service';

import { Component, OnInit, inject } from '@angular/core';

@Component({
  selector: 'app-switch-theme',
  templateUrl: './switch-theme.component.html',
  standalone: false
})
export class SwitchThemeComponent implements OnInit {
  theme$: Subject<string | null>;

  theme: string;

  faSun = faSun;
  faMoon = faMoon;

  private themes = inject(ThemeService);

  ngOnInit(): void {
    this.theme$ = this.themes.theme$;
    this.theme = this.themes.current;
  }

  public currentTheme(): string {
    return this.themes.current;
  }

  public selectTheme(value: string): void {
    this.themes.current = value;
  }
}
