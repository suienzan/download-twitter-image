const format = (filename: string): string => {
  const illegalCharacters = /[/:*?"<>|]/g;
  const whitespace = /\s+/g;
  return filename.replace(illegalCharacters, ' ').replace(whitespace, ' ');
};

export default class Filename {
  #filename: string;

  constructor(filename: string) {
    this.#filename = filename;
  }

  get filename(): string {
    return this.#filename;
  }

  patchName(tweet: HTMLElement): Filename {
    if (!this.#filename.includes('{name}')) return this;

    const name =
      tweet.querySelector('[data-testid="User-Names"] > div:first-child')
        ?.textContent ?? '';

    return new Filename(this.#filename.replace('{name}', format(name)));
  }

  patchScreenName(screenName: string): Filename {
    if (!this.#filename.includes('{screen_name}')) return this;

    return new Filename(
      this.#filename.replace('{screen_name}', format(screenName)),
    );
  }

  patchId(id: string): Filename {
    if (!this.#filename.includes('{id}')) return this;

    return new Filename(this.#filename.replace('{id}', id));
  }

  patchText(tweet: HTMLElement): Filename {
    const matches = /{(\[(.*)])?text(\[(\d+)])?}/.exec(this.#filename);
    if (!matches) return this;

    const text =
      tweet?.querySelector('[data-testid="tweetText"] ')?.textContent ?? '';

    const [match, , prefix, , lengthString] = matches;

    const length = Number(lengthString);

    const sliced =
      length > 0
        ? [
            ...new Intl.Segmenter(undefined, {
              granularity: 'grapheme',
            }).segment(text),
          ]
            .slice(0, Number(length))
            .map((part) => part.segment)
            .join('')
        : text;

    const textString = sliced.length === 0 ? '' : `${prefix}${format(sliced)}`;

    return new Filename(this.#filename.replace(match, textString));
  }

  patchPage(tweet: HTMLElement, image: string): Filename {
    const imageRegex = /https:\/\/(mobile.)?x.com(\/.*\/photo\/)(\d)/;
    const [, , postPath, page] = imageRegex.exec(image) ?? [];

    if (!postPath || !page) return this;

    const imageElements = tweet.querySelectorAll(`[href^="${postPath}"]`);

    const { length } = Array.from(imageElements);

    const pageRegex = /.*({(\[(.*)])?page})/;
    const [, match, , prefix] = pageRegex.exec(this.#filename) ?? [];

    const filename = this.#filename.replace(
      match,
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
  }): string {
    return this.patchName(tweet)
      .patchId(id)
      .patchScreenName(screenName)
      .patchText(tweet)
      .patchPage(tweet, image).filename;
  }
}
