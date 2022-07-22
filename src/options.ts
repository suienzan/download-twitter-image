import { DEFAULT_FILENAME, getFilenamePattern } from './utils';

const getInput = () => document.querySelector('#filename') as HTMLInputElement;

const saveOptions = (e: Event) => {
  const input = getInput();

  if (input.value === '') {
    input.value = DEFAULT_FILENAME;
    chrome.storage.sync.remove('filename');
  } else {
    chrome.storage.sync.set({
      filename: input.value,
    });
  }

  e.preventDefault();
};

const restoreOptions = () => {
  const input = getInput();

  getFilenamePattern().then((filename) => {
    input.value = filename;
  });
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector('form')?.addEventListener('submit', saveOptions);
