import { MapID, MapType, MapData } from '../sense/map';
import { graphQLUserFieldsFragment, GraphQLUserFields, toUserData } from './user';
import { client } from './client';
import * as SN from '../session';
import * as moment from 'moment';

const graphQLMapFieldsFragment = `
  fragment mapFields on Map {
    id, createdAt, updatedAt, type, name, description, tags, image
    owner { ...userFields }
  }`;

export interface GraphQLMapFields {
  id:          string;
  type:        string;
  createdAt:   string;
  updatedAt:   string;
  name:        string;
  description: string;
  tags:        string;
  image:       string;
  owner:       GraphQLUserFields | null;
}

const toMapData: (m: GraphQLMapFields) => MapData =
  m => ({
    id:          m.id,
    type:        MapType[m.type] || MapType.PUBLIC,
    createdAt:   +moment(m.createdAt),
    updatedAt:   +moment(m.updatedAt),
    name:        m.name || '',
    description: m.description || '',
    tags:        m.tags || '',
    image:       m.image || '',
    owner:       toUserData(m.owner),
  });

export const loadMaps =
  (user: SN.User) => {
    const query = `
      query AllMaps {
        allMaps {
          ...mapFields
        }
      }
      ${graphQLMapFieldsFragment}
      ${graphQLUserFieldsFragment}
    `;
    return client(user).request(query)
      .then(({ allMaps }) => allMaps.map(toMapData));
  };

export const create =
  (user: SN.User, map: MapData) => {
    const query = `
      mutation CreateMap($type: String, $name: String, $description: String, $tags: String, $image: String) {
        createMap(type: $type, name: $name, description: $description, tags: $tags, image: $image) {
          ...mapFields
        }
      }
      ${graphQLMapFieldsFragment}
      ${graphQLUserFieldsFragment}
    `;
    return client(user).request(query, map)
      .then(({ createMap }) => toMapData(createMap));
  };

export const update =
  (user: SN.User, map: MapData) => {
    const query = `
      mutation UpdateMap($id: ID!, $type: String, $name: String, $description: String, $tags: String, $image: String) {
        updateMap(id: $id, type: $type, name: $name, description: $description, tags: $tags, image: $image) {
          ...mapFields
        }
      }
      ${graphQLMapFieldsFragment}
      ${graphQLUserFieldsFragment}
    `;
    return client(user).request(query, map)
      .then(({ updateMap }) => toMapData(updateMap));
  };

export const remove =
  (user: SN.User, mapID: MapID) => {
    const query = `
      mutation DeleteMap($mapID: ID!) {
        deleteMap(id: $mapID) { ...mapFields }
      }
      ${graphQLMapFieldsFragment}
      ${graphQLUserFieldsFragment}
    `;
    const variables = { mapID };
    return client(user).request(query, variables)
      .then(({ deleteMap }) => toMapData(deleteMap));
  };
