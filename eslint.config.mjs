import { defineConfig, globalIgnores } from 'eslint/config';
import _import from 'eslint-plugin-import';
import { fixupPluginRules } from '@eslint/compat';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import angular from 'angular-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default defineConfig([
  globalIgnores(['projects/**/*', 'src/generated/**/*']),
  {
    files: ['**/*.ts'],

    extends: [
      ...compat.extends('eslint:recommended', 'plugin:@typescript-eslint/recommended'),
      ...angular.configs.tsRecommended,
      ...compat.extends('plugin:prettier/recommended')
    ],

    processor: angular.processInlineTemplates,

    plugins: {
      import: fixupPluginRules(_import)
    },

    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],

      '@angular-eslint/prefer-standalone': 'off',

      // The Angular 22 migration pinned the existing components to Eager change detection so the
      // upgrade keeps their behaviour; moving them to OnPush is a change of its own
      '@angular-eslint/prefer-on-push-component-change-detection': 'off',

      'no-console': [
        'error',
        {
          allow: ['warn', 'error']
        }
      ],

      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['./*', '../*'],
              message: "Relative imports are forbidden. Please use path aliases (e.g., '@models', '@services')."
            }
          ]
        }
      ],

      'prettier/prettier': ['error'],

      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase'
        }
      ],

      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: '',
          style: 'kebab-case'
        }
      ],

      'sort-imports': [
        'error',
        {
          ignoreCase: false,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
          allowSeparatedGroups: true
        }
      ],

      'no-restricted-syntax': [
        'error',
        {
          selector: "MemberExpression[object.property.name='location'][property.name='reload']",
          message: 'Use ReloadService.reloadPage() instead of window.location.reload().'
        }
      ],

      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['sibling', 'parent', 'index']],

          pathGroups: [
            {
              pattern: '@angular/**',
              group: 'external',
              position: 'after'
            },
            {
              pattern: '@models/**',
              group: 'internal',
              position: 'before'
            },
            {
              pattern: '@services/**',
              group: 'internal',
              position: 'after'
            },
            {
              pattern: '@components/**',
              group: 'internal',
              position: 'after'
            },
            {
              pattern: '@datasources/**',
              group: 'internal',
              position: 'after'
            },
            {
              pattern: '@src/**',
              group: 'sibling',
              position: 'after'
            }
          ],

          pathGroupsExcludedImportTypes: ['builtin'],

          alphabetize: {
            order: 'asc',
            caseInsensitive: true
          },

          'newlines-between': 'always'
        }
      ]
    }
  },
  {
    files: ['**/*.html'],

    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],

    rules: {}
  },
  // === Disable prefer-inject for services ===
  {
    files: ['**/*.service.ts'],
    rules: {
      '@angular-eslint/prefer-inject': 'off'
    }
  },
  // === Specs: advance fake timers only with the async variants ===
  {
    files: ['**/*.spec.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "MemberExpression[object.property.name='location'][property.name='reload']",
          message: 'Use ReloadService.reloadPage() instead of window.location.reload().'
        },
        {
          selector:
            "CallExpression[callee.object.name='vi'][callee.property.name=/^(advanceTimersByTime|advanceTimersToNextTimer|runAllTimers|runOnlyPendingTimers)$/]",
          message:
            'Use the ...Async variant (e.g. await vi.advanceTimersByTimeAsync(ms)): the sync one does not flush promise and RxJS microtasks between timers, so assertions can run before the work they check.'
        }
      ]
    }
  },
  // === Allow window.location.reload() only in ReloadService ===
  {
    files: ['**/reload.service.ts'],
    rules: {
      'no-restricted-syntax': 'off'
    }
  }
]);
