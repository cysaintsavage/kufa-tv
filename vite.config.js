import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    // Raise chunk warning threshold (channel data is intentionally large)
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        /**
         * manualChunks — keep react + react-dom ALWAYS together in one chunk.
         * Splitting them apart causes duplicate React instances and broken hooks.
         * Only split unrelated heavy vendor libs (hls.js, framer-motion, etc.).
         */
        manualChunks(id) {
          if (!id.includes('node_modules')) return

          // hls.js is ~500 kB — isolate so it only loads on the Player page
          if (id.includes('hls.js')) return 'player'

          // framer-motion ~130 kB — separate cached chunk
          if (id.includes('framer-motion')) return 'framer'

          // lucide icons ~11 kB — separate cached chunk
          if (id.includes('lucide-react')) return 'ui'

          // zustand ~2.5 kB — keep with react-router in a shared vendor chunk
          // react + react-dom MUST stay in the same chunk (default vendor)
          // so we do NOT split them here — let Vite handle them automatically
        },
      },
    },
  },
})
