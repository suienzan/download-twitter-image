// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'tsup';

export default defineConfig((options) => {
  const target = options.env?.target;

  return {
    entry: ['src/background.ts', 'src/content-script.ts', 'src/options.ts'],
    outDir: `extension/${target}`,
    clean: true,
    platform: 'browser',
    target: 'esnext',
    format: ['iife'],
    onSuccess: `pnpm manifest:${target} && cp src/options.html extension/${target}/options.html`,
  };
});
