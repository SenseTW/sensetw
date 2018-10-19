import { ID, User, Annotation, annotationDataFields, annotationFields } from "./sql";
import * as C from "./card";
import * as T from "./transaction";
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
  user: User,
  args: any
): Promise<Annotation> {
  const a = toAnnotationField(args);

  let cardData;
  if (args.card) {
    const trx = T.createCard({ ...args.card, mapId: args.mapId });
    const r = await T.run(db, user, trx);
    cardData = r.transaction.data;
    a.cardId = r.transaction.data.id;
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
  user: User,
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
    const trx = T.updateCard(data.cardId, args.card);
    await T.run(db, user, trx);
  }

  return getAnnotation(db, id);
}

export async function deleteAnnotation(db: Knex, user: User, id: ID): Promise<Annotation> {
  const rows = await db("annotation")
    .where("id", id)
    .del()
    .returning(annotationFields);
  const data = rows[0];

  if (data.cardId) {
    const trx = T.deleteCard(data.cardId);
    const r = await T.run(db, user, trx);
    data.card = r.transaction.data;
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
