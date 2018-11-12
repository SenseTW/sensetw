import * as H from '../sense/has-id';
import * as OT from '../sense/object-type';
import { MapID } from '../sense/map';
import { ObjectType } from '../sense/object-type';
import { ObjectID, ObjectData } from '../sense/object';
import { AnchorType } from '../../graphics/drawing';
import {
  CardID,
  DEFAULT_WIDTH as DEFAULT_CARD_WIDTH,
  DEFAULT_HEIGHT as DEFAULT_CARD_HEIGHT
} from '../sense/card';
import {
  BoxID,
  DEFAULT_WIDTH as DEFAULT_BOX_WIDTH,
  DEFAULT_HEIGHT as DEFAULT_BOX_HEIGHT,
} from '../sense/box';
import { client } from './client';
import * as SN from '../session';
import * as moment from 'moment';

const graphQLObjectFieldsFragment = `
  fragment objectFields on Object {
    id, createdAt, updatedAt, x, y, width, height, zIndex,
    objectType, card { id } , box { id }, belongsTo { id }
  }`;

export interface GraphQLObjectFields {
  id:         string;
  createdAt:  string;
  updatedAt:  string;
  x:          number;
  y:          number;
  width:      number;
  height:     number;
  zIndex:     number;
  objectType: string;
  card?:      H.HasID<CardID>;
  box?:       H.HasID<BoxID>;
  belongsTo?: H.HasID<BoxID>;
}

const toObjectDataFieldData: (o: GraphQLObjectFields, isDeleted: boolean) => string =
  (o, isDeleted) => {
    switch (OT.fromString(o.objectType)) {
      case ObjectType.NONE: {
        if (isDeleted) { return ''; }
        throw Error('Object loaded from backend has no objectType.');
      }
      case ObjectType.CARD: {
        return H.idOrError(`Object <id=${o.id}> of type CARD does not has Card ID.`,
                           o.card);
      }
      case ObjectType.BOX: {
        return H.idOrError('Object of type BOX does not has Box ID.',
                           o.box);
      }
      default: {
        throw Error('Object loaded from backend has no objectType.');
      }
    }
  };

// TODO: should update server-side width
const getDefaultWidth = (type: ObjectType) => {
  switch (type) {
    case ObjectType.CARD: return DEFAULT_CARD_WIDTH;
    case ObjectType.BOX:  return DEFAULT_BOX_WIDTH;
    default:              return 0;
  }
};

// TODO: should update server-side height
const getDefaultHeight = (type: ObjectType) => {
  switch (type) {
    case ObjectType.CARD: return DEFAULT_CARD_HEIGHT;
    case ObjectType.BOX:  return DEFAULT_BOX_HEIGHT;
    default:              return 0;
  }
};

const toObjectData: (o: GraphQLObjectFields, isDeleted?: boolean) => ObjectData =
  (o, isDeleted = false) => ({
    id:         o.id,
    createdAt:  +moment(o.createdAt),
    updatedAt:  +moment(o.updatedAt),
    x:          o.x,
    y:          o.y,
    width:      o.width || getDefaultWidth(OT.fromString(o.objectType)),
    height:     o.height || getDefaultHeight(OT.fromString(o.objectType)),
    anchor:     AnchorType.CENTER,
    zIndex:     o.zIndex,
    objectType: OT.fromString(o.objectType),
    data:       toObjectDataFieldData(o, isDeleted),
    belongsTo:  H.idOrUndefined(o.belongsTo),
  });

export const loadRawObjects =
  (user: SN.User, id: MapID): Promise<GraphQLObjectFields[]> => {
    const query = `
      query AllObjects($id: ID!) {
        allObjects(filter: { map: { id: $id } }) {
          ...objectFields
        }
      }
      ${graphQLObjectFieldsFragment}
    `;
    const variables = { id };
    return client(user).request(query, variables)
      .then(({ allObjects }) => allObjects);
  };

export const loadObjects =
  (user: SN.User, id: MapID): Promise<ObjectData[]> =>
    loadRawObjects(user, id).then(os => os.map(o => toObjectData(o)));

const loadRawObjectsById =
  (user: SN.User, ids: ObjectID[]): Promise<GraphQLObjectFields[]> => {
    if (ids.length === 0) {
      return Promise.resolve([]);
    }
    const query = `
      query {
        ${ids.map((id, i) =>
          `object_${i}: Object(id: "${id}") {
            ...objectFields
          }`
        )}
      }
      ${graphQLObjectFieldsFragment}
    `;
    return client(user).request(query)
      .then(data => Object.values(data));
  };

export const loadObjectsById =
  (user: SN.User, ids: ObjectID[]): Promise<ObjectData[]> =>
    loadRawObjectsById(user, ids).then(os => os.map(o => toObjectData(o)));

export const loadObjectIds =
  (user: SN.User, id: MapID): Promise<ObjectID[]> => {
    const query = `
      query AllObjects($id: ID!) {
        allObjects(filter: { map: { id: $id } }) { id }
      }
    `;
    const variables = { id };
    return client(user).request(query, variables)
      .then(({ allObjects }: { allObjects: H.HasID<ObjectID>[] }) => allObjects.map(x => x.id));
  };

export const create =
  (user: SN.User, mapId: MapID, data: ObjectData) => {
    const query = `
      mutation CreateObject(
        $x: Float!,
        $y: Float!,
        $width: Float!,
        $height: Float!,
        $zIndex: Float!,
        $objectType: ObjectType!,
        $data: ID,
        $mapId: ID
      ) {
        createObject(
          x: $x,
          y: $y,
          width: $width,
          height: $height,
          zIndex: $zIndex,
          objectType: $objectType,
          ${
            data.objectType === ObjectType.BOX
              ? 'boxId: $data,' :
            data.objectType === ObjectType.CARD
              ? 'cardId: $data,' :
            // otherwise
              ''
          }
          mapId: $mapId
        ) {
          ...objectFields
        }
      }
      ${graphQLObjectFieldsFragment}
    `;
    return client(user).request(query, { ...data, mapId })
      .then(({ createObject }) => toObjectData(createObject));
  };

export const move =
  (user: SN.User, id: ObjectID, x: number, y: number) => {
    const query = `
      mutation MoveObject($id: ID!, $x: Float!, $y: Float!) {
        updateObject(id: $id, x: $x, y: $y) {
          ...objectFields
        }
      }
      ${graphQLObjectFieldsFragment}
    `;
    const variables = { id, x, y };
    return client(user).request(query, variables)
      .then(({ updateObject }) => toObjectData(updateObject));
  };

export const updateObjectType =
  (user: SN.User, id: ObjectID, objectType: ObjectType) => {
    const query = `
      mutation MoveObject($id: ID!, $objectType: ObjectType!) {
        updateObject(id: $id, objectType: $objectType) {
          ...objectFields
        }
      }
      ${graphQLObjectFieldsFragment}
    `;
    const variables = { id, objectType };
    return client(user).request(query, variables)
      .then(({ updateObject }) => toObjectData(updateObject));
  };

export const remove =
  (user: SN.User, objectID: ObjectID) => {
    const query = `
      mutation DeleteObject($objectID: ID!) {
        deleteObject(id: $objectID) { ...objectFields }
      }
      ${graphQLObjectFieldsFragment}
    `;
    const variables = { objectID };
    return client(user).request(query, variables)
      .then(({ deleteObject }) => {
        // patch the object type, because Graphcool will not sync it with the
        // box/card field for us
        deleteObject.objectType = 'NONE';
        return toObjectData(deleteObject, true);
      });
  };
