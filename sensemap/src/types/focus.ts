import { ObjectType } from './object-type';
import { BoxID } from './sense-box';
import { CardID } from './sense-card';

type FocusNothing = {
  objectType: ObjectType.NONE,
};

export const focusNothing = (): FocusNothing => ({
  objectType: ObjectType.NONE,
});

type FocusBox = {
  objectType: ObjectType.BOX,
  data: BoxID,
};

export const focusBox = (data: BoxID): FocusBox => ({
  objectType: ObjectType.BOX,
  data,
});

type FocusCard = {
  objectType: ObjectType.CARD,
  data: CardID,
};

export const focusCard = (data: CardID): FocusCard => ({
  objectType: ObjectType.CARD,
  data
});

/**
 * Focus type is also a partial ObjectData.
 */
export type Focus
  = FocusNothing
  | FocusBox
  | FocusCard;
