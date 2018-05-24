import { ObjectType } from './object-type';
import { BoxID } from './box';
import { CardID } from './card';

type FocusNothing = {
  objectType: ObjectType.NONE,
};

/**
 * The `FocusNothing` constructor. It focuses nothing.
 */
export const focusNothing = (): FocusNothing => ({
  objectType: ObjectType.NONE,
});

type FocusBox = {
  objectType: ObjectType.BOX,
  data: BoxID,
};

/**
 * The `FocusBox` constructor. It focuses on a box.
 *
 * @param {BoxID} data A box id.
 */
export const focusBox = (data: BoxID): FocusBox => ({
  objectType: ObjectType.BOX,
  data,
});

type FocusCard = {
  objectType: ObjectType.CARD,
  data: CardID,
};

/**
 * The `FocusCard` constructor. It focuses on a card.
 *
 * @param {CardID} data A card id.
 */
export const focusCard = (data: CardID): FocusCard => ({
  objectType: ObjectType.CARD,
  data
});

/**
 * It describes how we focus something in the sense map.
 *
 * Notice that TypeScript can't inference it correctly if one destructuring it
 * to an object type and an id.
 *
 * ```
 * // don't do this if you want to check the object type for data
 * const { objectType, data } = focus;
 * ```
 *
 * It is also a `PartialObjectData`.
 */
export type Focus
  = FocusNothing
  | FocusBox
  | FocusCard;
