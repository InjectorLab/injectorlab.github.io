import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { version } from './package.json';

export default defineConfig({
  base: '/',
  build: {
    sourcemap: false
  },
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(version)
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        maximumFileSizeToCacheInBytes: 10000000
      },
      includeAssets: [
        'icons/16.png',
        'icons/32.png',
        'icons/48.png',
        'icons/192.png',
        'icons/512.png'
      ],
      manifest: {
        name: 'InjectorLab',
        short_name: 'Injector Lab',
        start_url: '/',
        display: 'standalone',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        icons: [
          {
            src: 'icons/192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'icons/512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'icons/48.png',
            sizes: '48x48',
            type: 'image/png'
          },
          {
            src: 'icons/32.png',
            sizes: '32x32',
            type: 'image/png'
          },
          {
            src: 'icons/16.png',
            sizes: '16x16',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});