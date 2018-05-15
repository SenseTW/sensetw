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