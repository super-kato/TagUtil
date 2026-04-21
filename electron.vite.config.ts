import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'electron-vite';
import { resolve } from 'path';

export default defineConfig({
  main: {
    resolve: {
      alias: {
        '@shared': resolve('src/shared'),
        '@domain': resolve('src/domain'),
        '@services': resolve('src/main/services'),
        '@main': resolve('src/main'),
        '@utils': resolve('src/main/utils'),
        '@ipc': resolve('src/main/ipc'),
        '@protocols': resolve('src/main/protocols'),
        '@resources': resolve('resources'),
        '@root': resolve('.')
      }
    }
  },
  preload: {
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
        '@services': resolve('src/renderer/src/services'),
        '@stores': resolve('src/renderer/src/stores'),
        '@components': resolve('src/renderer/src/components'),
        '@infrastructure': resolve('src/renderer/src/infrastructure'),
        '@utils': resolve('src/renderer/src/utils'),
        '@constants': resolve('src/renderer/src/constants'),
        '@resources': resolve('resources'),
        '@root': resolve('.')
      }
    },
    plugins: [svelte()]
  }
});
