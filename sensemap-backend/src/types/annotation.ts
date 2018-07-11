import { ID, Annotation, annotationDataFields, annotationFields } from './sql';
import * as Knex from 'knex';
import { assoc, pick } from 'ramda';

export async function getAnnotation(db: Knex, id: ID): Promise<Annotation> {
  const a = await db.select(annotationFields(db)).from('annotation').where('id', id).first();
  return !!a ? a : null;
}

function toAnnotationField(args: Annotation) {
  return assoc(
    'target', typeof(args.target) === 'string' ? args.target : JSON.stringify(args.target),
    pick(annotationDataFields, args));
}

export async function createAnnotation(db: Knex, args: Annotation): Promise<Annotation> {
  const a = toAnnotationField(args);
  const rows = await db('annotation').insert(a).returning(annotationFields(db));
  return rows[0];
}

export async function updateAnnotation(db: Knex, id: ID, args: Annotation): Promise<Annotation> {
  const a = toAnnotationField(args);
  const rows = await db('annotation').update(a).where('id', id).returning(annotationFields(db));
  return rows[0];
}

export async function deleteAnnotation(db: Knex, id: ID): Promise<Annotation> {
  const rows = await db('annotation').where('id', id).del().returning(annotationFields(db));
  return rows[0];
}
