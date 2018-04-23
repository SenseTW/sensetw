export type TimeStamp = number;

export type Color = string;

/**
 * Cryptographically unsafe ID generator.  Only used for experimenting.
 */
export function objectId() {
  const idLength = 32;
  const chars = 'abcedfghijklmnopqrstuvwxyz0123456789';
  const randomChar = () => chars[Math.floor(Math.random() * chars.length)];
  return Array(idLength).fill(0).map(randomChar).join('');
}