import { applicationConfig, type Preview } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

// Styles (tailwind.css + styles.scss) are inherited from the angular build target
// via browserTarget in angular.json — do NOT import them here, or Storybook's
// webpack CSS pipeline tries to re-process them without the @tailwindcss/postcss plugin.

import { registerEChartsModules } from '../src/app/shared/graphs/echarts/echarts.config';
registerEChartsModules();

const stubbedActivatedRoute = {
  snapshot: {
    params: {},
    queryParams: {},
    data: {},
    url: [],
    paramMap: { get: () => null, getAll: () => [], has: () => false, keys: [] },
    queryParamMap: { get: () => null, getAll: () => [], has: () => false, keys: [] }
  },
  params: of({}),
  queryParams: of({}),
  data: of({}),
  url: of([]),
  fragment: of(null),
  paramMap: of({ get: () => null, getAll: () => [], has: () => false, keys: [] }),
  queryParamMap: of({ get: () => null, getAll: () => [], has: () => false, keys: [] })
};

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Theme',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' }
        ],
        dynamicTitle: true
      }
    }
  },
  decorators: [
    (storyFn, ctx) => {
      const theme = (ctx.globals['theme'] as string) ?? 'light';
      document.body.classList.toggle('light-theme', theme === 'light');
      document.body.classList.toggle('dark-theme', theme === 'dark');
      return storyFn();
    },
    applicationConfig({
      providers: [
        provideAnimations(),
        provideRouter([]),
        provideHttpClient(),
        { provide: ActivatedRoute, useValue: stubbedActivatedRoute }
      ]
    })
  ],
  parameters: {
    layout: 'centered',
    backgrounds: { disable: true },
    controls: {
      expanded: true,
      matchers: { color: /(background|color)$/i, date: /Date$/i }
    }
  }
};

export default preview;
