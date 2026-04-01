export const DEFAULT_FILENAME =
  'twitter/{screen_name} - {id}{[ - ]text[28]}{[ - ]page}';

export const getStorage = async (
  key: string,
  defaultValue = '',
): Promise<string> =>
  new Promise((resolve) => {
    chrome.storage.sync.get(
      key,
      (items: Record<string, string | undefined>) => {
        resolve(items[key] ?? defaultValue);
      },
    );
  });

export const getFilenamePattern = async (): Promise<string> =>
  getStorage('filename', DEFAULT_FILENAME);
