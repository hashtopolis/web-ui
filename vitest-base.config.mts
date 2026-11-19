import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    env: { TZ: 'Europe/Berlin' },
    expect: { requireAssertions: true },
    silent: 'passed-only'
  }
});
