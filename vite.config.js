import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        // three + R3F en su propio chunk: se descarga después del primer pintado.
        manualChunks(id) {
          if (id.includes('node_modules/three') || id.includes('@react-three') || id.includes('meshoptimizer')) return 'three';
          if (id.includes('node_modules/gsap')) return 'gsap';
        },
      },
    },
  },
});
