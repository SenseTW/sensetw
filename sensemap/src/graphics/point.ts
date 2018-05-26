
export class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  toTuple(): [number, number] {
    return [this.x, this.y];
  }

  negate(): Point {
    return new Point(-this.x, -this.y);
  }

  add(other: Point): Point {
    return new Point(this.x + other.x, this.y + other.y);
  }

  subtract(other: Point): Point {
    return this.add(other.negate());
  }
}

/**
 * An accumulator that adds up a series of points and return the result.
 * It can manage multiple series, each identified by a string key.
 */
class Accumulator {
  store: { [key: string]: Point };

  constructor() {
    this.store = {};
  }

  /**
   * Set accumulating a series.
   *
   * @param key   key of the series
   * @param p     initial value of the series
   */
  set(key: string, p: Point): Point {
    this.store[key] = p;
    return this.store[key];
  }

  /**
   * Add a point to series .
   *
   * @param key   key of the series
   * @param p     point to add
   */
  add(key: string, p: Point): Point {
    this.store[key] = this.store[key].add(p);
    return this.store[key];
  }

  /**
   * Delete internal storage of a series.
   *
   * @param key   key of the series
   */
  delete(key: string): void {
    delete(this.store[key]);
  }
}

const accumulator = new Accumulator;

/**
 * Helper function to calculate moving distance.
 *
 * An `anchor` is the x and y value you set to place an object on
 * screen.  To use this:
 *
 * 1. Call `moveStart` to record the object anchor and the starting
 *    cursor position.
 * 2. Call `moveEnd` to supply ending cursor position.
 * 3. `moveEnd` will return the new anchor of the object, so that you
 *    can place the object onto the new position.
 *
 * @param id        string key to the object
 * @param anchor    anchor of the object
 * @param cursor    cursor starting position
 */
export function moveStart(id: string, anchor: Point, cursor: Point): void {
  accumulator.set(id, cursor.subtract(anchor));
}

/**
 * Helper function to calculate moving distance.  Use with `moveStart`.
 *
 * @param id        string key to the object
 * @param cursor    cursor ending position
 */
export function moveEnd(id: string, cursor: Point): Point {
  const r = accumulator.add(id, cursor);
  accumulator.delete(id);
  return r;
}
