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

interface Identifiable {
  id: string;
}

export function arrayToObject<T extends Identifiable>(this: void, data: T[]): { [key: string]: T } {
  return data.reduce((o, item) => { o[item.id] = item; return o; }, {});
}
