import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        react: resolve(__dirname, 'src/wrappers/react/index.tsx'),
      },
      formats: ['es', 'cjs'],
      // index → dist/esm/index.js + dist/cjs/index.js
      // react → dist/esm/react.js + dist/cjs/react.js
      fileName: (format, entryName) =>
        `${format === 'es' ? 'esm' : format}/${entryName}.js`,
    },
    rollupOptions: {
      // React is a peer dependency — never bundle it
      external: ['react'],
      output: {
        globals: { react: 'React' },
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
