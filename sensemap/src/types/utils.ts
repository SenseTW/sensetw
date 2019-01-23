import * as React from 'react';

export type GetComponentProps<T>
  = T extends React.ComponentType<infer P> | React.Component<infer P> ? P : never;

export type TimeStamp = number;

export const TIME_FORMAT = 'YYYY-M-DD HH:mm';

export const MAP_TIME_FORMAT = 'YYYY.MM.DD';

export const MAP_DETAILED_TIME_FORMAT = 'YYYY.MM.DD HH:mm';

export const HISTORY_TIME_FORMAT = 'YYYY.MM.DD';

export const SQRT3 = 1.73205;

export const POPUP_DELAY = 500;

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

export function sanitizeURL(a?: string): string {
  if (!a) {
    return '';
  }
  return a.replace(/\/+$/, '');
}

export function log<T>(value: T): T {
  // tslint:disable-next-line:no-console
  console.log(value);
  return value;
}

export function error<T>(err: Error): void {
  // tslint:disable-next-line:no-console
  console.error(err);
}

export const delay = (time: number) => <T>(value: T): Promise<T> => new Promise(resolve =>
  setTimeout(resolve, time, value)
);