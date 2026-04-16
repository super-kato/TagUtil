import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    alias: {
      '@shared': resolve(__dirname, 'src/shared'),
      '@domain': resolve(__dirname, 'src/domain'),
      '@services': resolve(__dirname, 'src/main/services')
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/**/*.d.ts', 'src/main/index.ts']
    },
    reporters: process.env.GITHUB_ACTIONS ? ['default', 'github-actions'] : ['default']
  }
});
