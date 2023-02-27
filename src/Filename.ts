const format = (filename: string): string => {
  const illegalCharacters = /[/:*?"<>|]/g;
  const whitespace = /\s+/g;
  return filename.replace(illegalCharacters, ' ').replace(whitespace, ' ');
};

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

    return new Filename(this.#filename.replace('{name}', format(name)));
  }

  patchScreenName(screenName: string) {
    if (!this.#filename.includes('{screen_name}')) return this;

    return new Filename(this.#filename.replace('{screen_name}', format(screenName)));
  }

  patchId(id: string) {
    if (!this.#filename.includes('{id}')) return this;

    return new Filename(this.#filename.replace('{id}', id));
  }

  patchText(tweet: HTMLElement) {
    const matches = this.#filename.match(/{(\[(.*)])?text(\[(\d+)])?}/);
    if (!matches) return this;

    const text = tweet?.querySelector('[data-testid="tweetText"] ')?.textContent || '';

    const [match, , prefix, , lengthString] = matches;

    const length = Number(lengthString);

    const sliced = length > 0 ? text.slice(0, Number(length)) : text;

    const textString = sliced.length === 0 ? '' : `${prefix}${format(sliced)}`;

    return new Filename(this.#filename.replace(match, textString));
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
