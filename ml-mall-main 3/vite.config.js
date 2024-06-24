import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';
import progress from 'vite-plugin-progress';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    vueJsx(),
    Components({
      resolvers: [VantResolver()],
    }),
    progress(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // outDir: 'ml-mall',
    // rollupOptions: {
    //   output: {
    //     sanitizeFileName(fileName) {
    //       const match = /^[a-z]:/i.exec(fileName);
    //       const driveLetter = match ? match[0] : '';
    //       return (
    //         driveLetter +
    //         fileName
    //           .slice(driveLetter.length)
    //           .replace(/[\x00-\x1F\x7F<>*#"{}|^[\]`;?:&=+$,]/g, '')
    //       );
    //     },
    //   },
    // },
  },
});
