import { ID, Annotation, annotationDataFields, annotationFields } from "./sql";
import * as C from "./card";
import * as Knex from "knex";
import { assoc, pick, filter, isEmpty } from "ramda";

export async function getAnnotation(db: Knex, id: ID): Promise<Annotation> {
  const a = await db
    .select(annotationFields)
    .from("annotation")
    .where("id", id)
    .first();
  if (!a) {
    return null;
  }
  a.card = await C.getCard(db, a.cardId);
  return a;
}

function toAnnotationField(args: Annotation) {
  const data = filter(
    x => !!x,
    assoc(
      "target",
      typeof args.target === "string"
        ? args.target
        : JSON.stringify(args.target),
      pick(annotationDataFields, args)
    )
  );
  return data;
}

export async function createAnnotation(
  db: Knex,
  args: any
): Promise<Annotation> {
  const a = toAnnotationField(args);

  let cardData;
  if (args.card) {
    cardData = await C.createCard(db, { ...args.card, mapId: args.mapId });
    a.cardId = cardData.id;
  }

  const rows = await db("annotation")
    .insert(a)
    .returning(annotationFields);
  const data = rows[0];

  if (cardData) {
    data.card = cardData;
  }

  return data;
}

export async function updateAnnotation(
  db: Knex,
  id: ID,
  args: any
): Promise<Annotation> {
  const data = await getAnnotation(db, id);

  const a = toAnnotationField(args);
  if (a && !isEmpty(a)) {
    await db("annotation")
      .update(a)
      .where("id", id)
      .returning(annotationFields);
  }

  if (args.card && !isEmpty(args.card)) {
    await C.updateCard(db, data.cardId, args.card);
  }

  return getAnnotation(db, id);
}

export async function deleteAnnotation(db: Knex, id: ID): Promise<Annotation> {
  const rows = await db("annotation")
    .where("id", id)
    .del()
    .returning(annotationFields);
  const data = rows[0];

  if (data.cardId) {
    data.card = await C.deleteCard(db, data.cardId);
  }

  return data;
}

export enum SelectorType {
  FragmentSelector,
  RangeSelector,
  TextPositionSelector,
  TextQuoteSelector
}

export type FragmentSelector = {
  type: SelectorType.FragmentSelector;
  conformsTo: string;
  value: string;
};

export type RangeSelector = {
  type: SelectorType.RangeSelector;
  endContainer: string;
  startContainer: string;
  startOffset: number;
  endOffset: number;
};

export type TextPositionSelector = {
  type: SelectorType.TextPositionSelector;
  start: number;
  end: number;
};

export type TextQuoteSelector = {
  type: SelectorType.TextQuoteSelector;
  exact: string;
  prefix: string;
  suffix: string;
};

export type Target =
  | FragmentSelector
  | RangeSelector
  | TextPositionSelector
  | TextQuoteSelector;

export function isTarget(o: any): o is Target {
  // XXX
  return !!o;
}
