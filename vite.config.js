import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const assetsList = [
  'apple-touch-icon.png',
  'icon-maskable.png',
  'icon.svg',
  'icon.png',
  'manifest.json',
];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-styled-components'],
      },
    }),
    VitePWA({
      includeAssets: [
        ...assetsList.map((h) => `/assets/light/${h}`),
        ...assetsList.map((h) => `/assets/dark/${h}`),
      ],
      manifest: false,
      registerType: 'autoUpdate',
      workbox: {
        navigateFallbackDenylist: [/\/__\/*/],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const chunks = ['i18n', 'react', 'firebase'];
          const found = chunks.find((v) => id.includes(v));
          if (found) return found;

          if (id.includes('node_modules')) {
            return 'vendor';
          }

          return null;
        },
      },
    },
  },
});
