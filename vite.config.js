import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    manifest: {
      name: 'GradifyAI',
      short_name: 'Gradify',
      start_url: '/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#0f172a',
      icons: [
        {
          src: '/gradifylogo.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/gradifylogo.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    }
  })],
})




