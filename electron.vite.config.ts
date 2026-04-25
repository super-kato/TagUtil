import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import { resolve } from 'path';

export default defineConfig({
  main: {
    plugins: [
      externalizeDepsPlugin({
        exclude: [
          'flac-tagger',
          'music-metadata',
          'fast-equals',
          'electron-updater',
          '@electron-toolkit/utils'
        ]
      })
    ],
    resolve: {
      alias: {
        '@shared': resolve('src/shared'),
        '@domain': resolve('src/domain'),
        '@services': resolve('src/main/services'),
        '@main': resolve('src/main'),
        '@resources': resolve('resources'),
        '@root': resolve('.')
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@shared': resolve('src/shared'),
        '@domain': resolve('src/domain'),
        '@resources': resolve('resources'),
        '@root': resolve('.')
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@shared': resolve('src/shared'),
        '@domain': resolve('src/domain'),
        '@resources': resolve('resources'),
        '@root': resolve('.')
      }
    },
    plugins: [svelte()]
  }
});
