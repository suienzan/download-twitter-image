import type { Browser } from 'webextension-polyfill';

declare global {
  // eslint-disable-next-line no-unused-vars
  const browser: Browser;
}
