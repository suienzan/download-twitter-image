// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'tsup';

export default defineConfig(() => ({
  entry: ['src/background.ts', 'src/content-script.ts', 'src/options.ts'],
  outDir: 'extension',
  clean: true,
  platform: 'browser',
  target: 'esnext',
  format: ['iife'],
  onSuccess: 'pnpm manifest && pnpm options',
}));
