const format = (filename: string): string => {
  const illegalCharacters = /[/:*?"<>|]/g;
  const whitespace = /\s+/g;
  return filename.replace(illegalCharacters, '_').replace(whitespace, ' ');
};

const formatBackslash = (x: string): string => x.replace('\\', '_');

// eslint-disable-next-line import/prefer-default-export
export class Filename {
  #filename: string;

  constructor(filename: string) {
    this.#filename = filename;
  }

  get filename() {
    return this.#filename;
  }

  patchName(tweet: HTMLElement) {
    if (!this.#filename.includes('{name}')) return this;

    const name = tweet.querySelector('[data-testid="User-Names"] > div:first-child')
      ?.textContent || '';

    return new Filename(this.#filename.replace('{name}', formatBackslash(name)));
  }

  patchScreenName(screenName: string) {
    if (!this.#filename.includes('{screen_name}')) return this;

    return new Filename(this.#filename.replace('{screen_name}', formatBackslash(screenName)));
  }

  patchId(id: string) {
    if (!this.#filename.includes('{id}')) return this;

    return new Filename(this.#filename.replace('{id}', formatBackslash(id)));
  }

  patchText(tweet: HTMLElement) {
    const matches = this.#filename.match(/{text(\[(\d+)])?}/);
    if (!matches) return this;

    const text = tweet?.querySelector('[data-testid="tweetText"] ')?.textContent || '';
    const formatedText = format(text);

    const [match, , lengthString] = matches;

    const length = Number(lengthString);

    const sliced = length > 0 ? formatedText.slice(0, Number(length)) : formatedText;

    return new Filename(this.#filename.replace(match, formatBackslash(sliced)));
  }

  patchPage(tweet: HTMLElement, image: string) {
    const imageRegex = /https:\/\/(mobile.)?twitter.com(\/.*\/photo\/)(\d)/;
    const [, , postPath, page] = image.match(imageRegex) || [];

    if (!postPath || !page) return this;

    const imageElements = tweet.querySelectorAll(`[href^="${postPath}"]`);

    const { length } = Array.from(imageElements);

    const pageRegex = /.*({\[(.*)]page})/;
    const [, pageString, prefix] = this.#filename.match(pageRegex) || [];

    const filename = this.#filename.replace(
      pageString,
      length === 1 ? '' : `${prefix}${page}`,
    );

    return new Filename(filename);
  }

  getPatchedFilename({
    tweet,
    image,
    screenName,
    id,
  }: {
    tweet: HTMLElement;
    image: string;
    screenName: string;
    id: string;
  }) {
    return this.patchName(tweet)
      .patchId(id)
      .patchScreenName(screenName)
      .patchText(tweet)
      .patchPage(tweet, image).filename;
  }
}
