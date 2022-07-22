import jsonfile from 'jsonfile';
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';

const json = (
  await readFile(new URL('../package.json', import.meta.url))
).toString();

const { version, displayName } = JSON.parse(json);

const file = fileURLToPath(
  new URL('../extension/manifest.json', import.meta.url),
);

const manifest = {
  name: displayName,
  version,
  manifest_version: 3,
  permissions: [
    'cookies',
    'downloads',
    'contextMenus',
    'notifications',
    'storage',
  ],
  host_permissions: ['https://mobile.twitter.com/*', 'https://twitter.com/*'],
  background: {
    service_worker: 'background.global.js',
    type: 'module',
  },
  content_scripts: [
    {
      matches: ['*://*/*'],
      js: ['content-script.global.js'],
      type: 'module',
    },
  ],
  options_ui: {
    page: 'options.html',
  },
};

jsonfile.writeFile(file, manifest, { spaces: 2 });
