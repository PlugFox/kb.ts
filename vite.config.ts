import devtools from 'solid-devtools/vite';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [devtools(), solidPlugin()],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
  // Конфигурация для GitHub Pages
  base: process.env.NODE_ENV === 'production'
    ? '/kb.ts/' // Замените на имя вашего репозитория
    : '/',
});
