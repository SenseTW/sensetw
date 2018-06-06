export type TimeStamp = number;

/**
 * Cryptographically unsafe ID generator.  Only used for experimenting.
 */
export function objectId() {
  const idLength = 32;
  const chars = 'abcedfghijklmnopqrstuvwxyz0123456789';
  const randomChar = () => chars[Math.floor(Math.random() * chars.length)];
  return Array(idLength).fill(0).map(randomChar).join('');
}

export function noop() { return; }

export function toTags(str: string): string[] {
  return str.split(/,\s*/).filter(it => it);
}

export function fromTags(tags: string[]): string {
  return tags.join(', ');
}

export namespace Arr {
  export function replaceOrAppend<T>(array: T[], index: number, element: T): T[] {
    const i = index === -1 ? array.length : index;

    return [
      ...array.slice(0, i),
      element,
      ...array.slice(i + 1),
    ];
  }

  export function remove<T>(array: T[], index: number): T[] {
    if (index < 0 || index >= array.length) {
      return array;
    }

    return [
      ...array.slice(0, index),
      ...array.slice(index + 1),
    ];
  }
}