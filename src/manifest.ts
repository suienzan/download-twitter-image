import jsonfile from 'jsonfile';
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';

const json = (
  await readFile(new URL('../package.json', import.meta.url))
).toString();

const { version, displayName } = JSON.parse(json);

const geckoId = 'download-twitter-image@suienzan';

const file = fileURLToPath(
  new URL('../extension/manifest.json', import.meta.url),
);

const manifest = {
  name: displayName,
  version,
  manifest_version: 2,
  permissions: [
    'cookies',
    'downloads',
    'https://mobile.twitter.com/*',
    'https://twitter.com/*',
    'menus',
    'notifications',
    'storage',
  ],
  background: {
    scripts: ['background.global.js'],
  },
  content_scripts: [
    {
      matches: ['*://*/*'],
      js: ['content-script.global.js'],
    },
  ],
  options_ui: {
    page: 'options.html',
    browser_style: true,
  },
  applications: {
    gecko: {
      id: geckoId,
    },
  },
};

jsonfile.writeFile(file, manifest, { spaces: 2 });
