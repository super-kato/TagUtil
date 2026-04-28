import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'electron-vite';
import { resolve } from 'path';

export default defineConfig(() => {
  const isDebug = process.env.DEBUG === 'true' || process.env.NODE_ENV === 'development';

  return {
    main: {
      build: {
        sourcemap: isDebug,
        externalizeDeps: {
          exclude: [
            'flac-tagger',
            'music-metadata',
            'fast-equals',
            'electron-log',
            'electron-updater',
            '@electron-toolkit/utils'
          ]
        }
      },
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
      build: {
        sourcemap: isDebug
      },
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
      build: {
        sourcemap: isDebug
      },
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
  };
});
