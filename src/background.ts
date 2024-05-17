import { name, displayName } from '../package.json';

chrome.contextMenus.create({
  id: name,
  title: displayName,
  documentUrlPatterns: [
    'https://x.com/*',
    'https://mobile.x.com/*',
  ],
  contexts: ['image'],
  targetUrlPatterns: ['https://pbs.twimg.com/media/*'],
});

chrome.contextMenus.onClicked.addListener(async (item, tab) => {
  const { srcUrl, linkUrl, pageUrl } = item;
  if (!(srcUrl && tab?.id)) return;

  const regex = /https:\/\/(mobile.)?x.com\/(.*)\/status\/(\d*).*/;
  const match = (linkUrl || pageUrl).match(regex);
  const [image, , screenName, id] = match || [];

  chrome.tabs.sendMessage(tab.id, {
    image,
    screenName,
    id,
    srcUrl,
  });
});

const showNotification = (message: string) => {
  chrome.notifications.create({
    type: 'basic',
    title: `ERROR in ${displayName}`,
    message,
    iconUrl:
      'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  });
};

chrome.runtime.onMessage.addListener(({ type, request, message }) => {
  switch (type) {
    case 'error':
      showNotification(message);
      break;
    case 'download':
      chrome.downloads.download(request).catch((err) => {
        showNotification(err.message);
      });
      break;
    default:
      showNotification('Unknown error.');
      break;
  }
});
