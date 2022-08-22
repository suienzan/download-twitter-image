import jsonfile from 'jsonfile';
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';

const json = (
  await readFile(new URL('../package.json', import.meta.url))
).toString();

const { version, displayName, geckoId } = JSON.parse(json);

const target = process.env.NODE_ENV;

const permissions = [
  'downloads',
  'contextMenus',
  'notifications',
  'storage',
];
const hostPermissions = [
  'https://mobile.twitter.com/*',
  'https://twitter.com/*',
];

const basic = {
  name: displayName,
  version,
  content_scripts: [
    {
      matches: ['*://*/*'],
      js: ['content-script.global.js'],
    },
  ],
  options_ui: {
    page: 'options.html',
  },
};

const firefox = {
  manifest_version: 2,
  permissions: [...permissions, ...hostPermissions],
  background: {
    scripts: ['background.global.js'],
  },
  browser_specific_settings: {
    gecko: {
      id: geckoId,
    },
  },
};

const chrome = {
  manifest_version: 3,
  permissions,
  host_permissions: hostPermissions,
  background: {
    service_worker: 'background.global.js',
  },
};

const manifest = target === 'firefox' ? { ...basic, ...firefox } : { ...basic, ...chrome };

const file = fileURLToPath(
  new URL(`../extension/${target}/manifest.json`, import.meta.url),
);

jsonfile.writeFile(file, manifest, { spaces: 2 });
