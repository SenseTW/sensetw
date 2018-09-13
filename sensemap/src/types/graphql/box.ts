import * as H from '../sense/has-id';
import { ObjectID } from '../sense/object';
import { MapID } from '../sense/map';
import { BoxID, BoxData, BoxType } from '../sense/box';
import { client } from './client';
import * as moment from 'moment';

const graphQLBoxFieldsFragment = `
  fragment boxFields on Box {
    id, createdAt, updatedAt, title, summary, tags, boxType,
    objects { id }, contains { id }, map { id }
  }`;

interface GraphQLBoxFields {
  id:        string;
  createdAt: string;
  updatedAt: string;
  title:     string;
  summary:   string;
  tags:      string;
  boxType:   string;
  objects:   H.HasID<ObjectID>[];
  contains:  H.HasID<ObjectID>[];
  map?:      H.HasID<MapID>;
}

const toBoxData: (b: GraphQLBoxFields) => BoxData =
  b => ({
    id:        b.id,
    createdAt: +moment(b.createdAt),
    updatedAt: +moment(b.updatedAt),
    title:     b.title,
    summary:   b.summary,
    tags:      b.tags || '',
    boxType:   (b.boxType || 'INFO') as BoxType,
    objects:   H.toIDMap(b.objects),
    contains:  H.toIDMap(b.contains),
  });

export const loadBoxes =
  (id: MapID) => {
    const query = `
      query AllBoxes($id: ID!) {
        allBoxes(filter: { map: { id: $id } }) {
          ...boxFields
        }
      }
      ${graphQLBoxFieldsFragment}
    `;
    const variables = { id };
    return client().request(query, variables)
      .then(({ allBoxes }) => allBoxes.map(toBoxData));
  };

export const create =
  (mapId: MapID, box: BoxData) => {
    const query = `
      mutation CreateBox($title: String, $summary: String, $tags: String, $boxType: BoxType, $mapId: ID) {
        createBox(title: $title, summary: $summary, tags: $tags, boxType: $boxType, mapId: $mapId) {
          ...boxFields
        }
      }
      ${graphQLBoxFieldsFragment}
    `;
    return client().request(query, { ...box, mapId })
      .then(({ createBox }) => toBoxData(createBox));
  };

export const update =
  (box: BoxData) => {
    const query = `
      mutation UpdateBox($id: ID!, $title: String, $summary: String, $tags: String, $boxType: BoxType) {
        updateBox(id: $id, title: $title, summary: $summary, tags: $tags, boxType: $boxType) {
          ...boxFields
        }
      }
      ${graphQLBoxFieldsFragment}
    `;
    return client().request(query, box)
      .then(({ updateBox }) => toBoxData(updateBox));
  };

export const remove =
  (boxID: BoxID) => {
    const query = `
      mutation DeleteBox($boxID: ID!) {
        deleteBox(id: $boxID) { ...boxFields }
      }
      ${graphQLBoxFieldsFragment}
    `;
    const variables = { boxID };
    return client().request(query, variables)
      .then(({ deleteBox }) => toBoxData(deleteBox));
  };
