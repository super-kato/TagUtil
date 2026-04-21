import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte({ hot: !process.env.VITEST })],
  test: {
    globals: true,
    environment: 'node',
    alias: {
      '@shared': resolve(__dirname, 'src/shared'),
      '@domain': resolve(__dirname, 'src/domain'),
      '@renderer': resolve(__dirname, 'src/renderer/src'),
      '@services': resolve(__dirname, 'src/main/services'),
      '@main': resolve(__dirname, 'src/main'),
      '@resources': resolve(__dirname, 'resources'),
      '@root': resolve(__dirname, '.')
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
