/**
 * ObjectType describes what an objcet hold.
 *
 * This will be used in many files other them object.ts. So we create this file
 * to prevent circular dependency.
 */
export enum ObjectType {
  NONE = 'NONE',
  CARD = 'CARD',
  BOX  = 'BOX',
}

/**
 * fromString creates a object type from a string.
 * @param {string} str The enum string.
 */
export function fromString(this: void, str: string): ObjectType {
  switch (name) {
    case 'NONE': return ObjectType.NONE;
    case 'CARD': return ObjectType.CARD;
    case 'BOX':  return ObjectType.BOX;
    default:     return ObjectType.NONE;
  }
}
