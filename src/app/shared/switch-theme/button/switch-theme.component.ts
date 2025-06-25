import { Component, OnInit } from '@angular/core';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

import { Subject } from 'rxjs';
import { ThemeService } from 'src/app/core/_services/shared/theme.service';

@Component({
  selector: 'app-switch-theme',
  templateUrl: './switch-theme.component.html',
  standalone: false
})
export class SwitchThemeComponent implements OnInit {
  theme$: Subject<string | null>;

  theme: any;

  faSun = faSun;
  faMoon = faMoon;

  constructor(private themes: ThemeService) {}

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
