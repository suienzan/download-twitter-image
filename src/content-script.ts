import Filename from './Filename';
import { getFilenamePattern } from './utils';

const HISTORY_KEY = 'download-twitter-image:history';

const readHistory = (): string[] => {
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item): item is string => typeof item === 'string');
  } catch {
    return [];
  }
};

const writeHistory = (history: string[]) => {
  try {
    window.localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify([...new Set(history)]),
    );
  } catch {
    // Ignore storage errors.
  }
};

const hasDownloadedBefore = (originalUrl: string): boolean =>
  readHistory().includes(originalUrl);

const rememberDownload = (originalUrl: string) => {
  const history = readHistory();
  if (history.includes(originalUrl)) return;
  history.push(originalUrl);
  writeHistory(history);
};

const getOriginalAndExtension = (x: string) => {
  const url = new URL(x);
  const format = url.searchParams.get('format');
  const extension = format ? `.${format}` : '';
  url.searchParams.set('name', 'orig');
  return { url: url.toString(), extension };
};

chrome.runtime.onMessage.addListener(
  async ({ image, screenName, id, srcUrl, page }) => {
    const tweet =
      document.querySelector(`main [href*="${id}"]`)?.closest('article') ??
      document.querySelector('article');

    if (!tweet) {
      chrome.runtime.sendMessage({
        type: 'error',
        message:
          'You need click the `...` in top right then click `View Tweet` before downloads.',
      });

      return;
    }

    const history = `${screenName}/${id}/${page}`;

    if (hasDownloadedBefore(history)) {
      // eslint-disable-next-line no-alert
      const confirmed = window.confirm(
        'This image has already been downloaded. Download it again?',
      );

      if (!confirmed) return;
    }

    rememberDownload(history);

    const filenamePattern = await getFilenamePattern();
    const filename = new Filename(filenamePattern).getPatchedFilename({
      tweet,
      image,
      screenName,
      id,
    });

    const { url, extension } = getOriginalAndExtension(srcUrl);

    chrome.runtime.sendMessage({
      type: 'download',
      request: { url, filename: `${filename}${extension}` },
    });
  },
);
