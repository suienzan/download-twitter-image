export const DEFAULT_FILENAME = 'twitter/{screen_name} - {id}{[ - ]text[28]}{[ - ]page}';

export const getStorage = (
  key: string,
  defaultValue: string = '',
): Promise<string> => new Promise((resolve) => {
  chrome.storage.sync.get(key, (items) => {
    resolve(items[key] || defaultValue);
  });
});

export const getFilenamePattern = () => getStorage('filename', DEFAULT_FILENAME);
