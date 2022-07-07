export const DEFAULT_FILENAME = 'twitter/{name} - {text[28]}{[ - ]page}';

export const getStorage = (
  key: string,
  defaultValue: string = '',
): Promise<string> => browser.storage.sync.get(key).then((res) => res[key] || defaultValue);

export const getFilenamePattern = () => getStorage('filename', DEFAULT_FILENAME);
