import { ThemeService } from 'src/app/core/_services/shared/theme.service';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-switch-theme',
  templateUrl: './switch-theme.component.html',
})
export class SwitchThemeComponent implements OnInit {
  theme$: Subject<string | null>;

  theme: any;

  faSun=faSun;
  faMoon=faMoon;

  constructor(
    private themes: ThemeService,
  ) { }

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

