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
        manualChunks: (id) => id.includes('node_modules') ? 'vendor' : null,
      },
    },
  },
});
