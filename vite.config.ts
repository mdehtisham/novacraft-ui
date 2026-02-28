import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'NovaCraftUI',
      formats: ['es', 'cjs', 'iife'],
    },
    rollupOptions: {
      output: {
        dir: 'dist',
        entryFileNames: '[format]/[name].js',
      },
    },
    sourcemap: true,
    minify: 'terser',
  },
  plugins: [dts({ rollupTypes: true })],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
