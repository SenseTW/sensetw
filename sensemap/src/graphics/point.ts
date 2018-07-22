import { Position as Point, BoundingBox } from './drawing';

export { Point };

export function toTuple(p: Point): [number, number] {
  return [p.x, p.y];
}

export function negate(p: Point): Point {
  return { x: -p.x, y: -p.y };
}

export function add(a: Point, b: Point): Point {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function subtract(a: Point, b: Point): Point {
  return add(a, negate(b));
}

export interface Transform {
  (p: Partial<BoundingBox>): BoundingBox;
}
