import { name, displayName } from '../package.json';

browser.menus.create({
  id: name,
  title: displayName,
  documentUrlPatterns: [
    'https://twitter.com/*',
    'https://mobile.twitter.com/*',
  ],
  contexts: ['image'],
  targetUrlPatterns: ['https://pbs.twimg.com/media/*'],
});

browser.menus.onClicked.addListener(async (item, tab) => {
  const { srcUrl } = item;
  if (!(srcUrl && tab?.id)) return;

  const regex = /https:\/\/(mobile.)?twitter.com\/(.*)\/status\/(\d*).*/;
  const match = item.linkUrl?.match(regex);
  const [image, , screenName, id] = match || [];

  browser.tabs.sendMessage(tab.id, {
    image,
    screenName,
    id,
    srcUrl,
  });
});

const showNotification = (message: string) => {
  browser.notifications.create({
    type: 'basic',
    title: `ERROR in ${displayName}`,
    message,
  });
};

browser.runtime.onMessage.addListener((request) => {
  browser.downloads.download(request).catch((err) => {
    showNotification(err.message);
  });
});
