import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'NovaCraftUI',
      formats: ['es', 'cjs', 'iife'],
      // Map Vite's 'es' format name → dist/esm/ to match package.json exports
      fileName: (format) => `${format === 'es' ? 'esm' : format}/index.js`,
    },
    rollupOptions: {
      output: {
        // Ensure the extracted CSS lands at dist/css/tokens.css
        assetFileNames: (info) => {
          if (info.name?.endsWith('.css')) return 'css/tokens.css';
          return 'assets/[name][extname]';
        },
      },
    },
    sourcemap: true,
    minify: 'terser',
  },
  plugins: [
    dts({
      rollupTypes: true,
      outDir: 'dist/types',
      tsconfigPath: './tsconfig.json',
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
