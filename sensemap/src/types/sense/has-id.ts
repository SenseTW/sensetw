/**
 * HasID is an object with an id.
 */
export interface HasID<T> {
  id: T;
}

/**
 * ObjectMap indexes objects by strings.
 *
 * @todo Move to another file.
 */
export interface ObjectMap<T> {
  [key: string]: T;
}

/**
 * idOrUndefined returns the id or undefined of an object.
 * @param {HasID<T>} o The object.
 */
export const idOrUndefined: <T>(o?: HasID<T>) => T | undefined =
  (o) => {
    if (!o) {
      return undefined;
    }
    return o.id;
  };

/**
 * idOrError returns the id of an object or throw an error.
 * @param {string} err The error message.
 * @param {HasID<T>} o The object.
 */
export const idOrError: <T>(err: string, o?: HasID<T>) => T =
  (err, o) => {
    if (!o) {
      throw Error(err);
    }
    return o.id;
  };

/**
 * toIDMap transforms an object list into an object map.
 * @param {HasID<T>} objects The object list.
 */
export function toIDMap<T extends string, U extends HasID<T>>(this: void, objects: U[]): ObjectMap<U> {
  return objects.reduce((acc, o) => { acc[o.id as string] = o; return acc; }, {});
}
