import { Filename } from './Filename';
import { getFilenamePattern } from './utils';

const getOriginalAndExtension = (x: string) => {
  const url = new URL(x);
  const format = url.searchParams.get('format');
  const extension = format ? `.${format}` : '';
  url.searchParams.set('name', 'orig');
  return { url: url.toString(), extension };
};

browser.runtime.onMessage.addListener(async ({
  image, screenName, id, srcUrl,
}) => {
  const tweet = document
    .querySelector(`main [href*="${id}"]`)
    ?.closest('article');

  if (!tweet) return;

  const filenamePartten = await getFilenamePattern();
  const filename = new Filename(filenamePartten).getPatchedFilename({
    tweet,
    image,
    screenName,
    id,
  });

  const { url, extension } = getOriginalAndExtension(srcUrl);

  browser.runtime.sendMessage({
    url,
    filename: `${filename}${extension}`,
  });
});
