import { HasID } from '../sense/has-id';
import { MapID } from '../sense/map';
import { ObjectID } from '../sense/object';
import { EdgeID, Edge } from '../sense/edge';
import { client } from './client';
import * as SN from '../session';

const graphQLEdgeFieldsFragment = `
  fragment edgeFields on Edge {
    id, map { id }, from { id }, to { id }
  }`;

interface GraphQLEdgeFields {
  id:     EdgeID;
  map:    HasID<MapID>;
  from:   HasID<ObjectID>;
  to:     HasID<ObjectID>;
}

const toEdge: (e: GraphQLEdgeFields) => Edge =
  e => ({
    id:   e.id,
    map:  e.map.id,
    from: e.from.id,
    to:   e.to.id,
  });

export const load =
  (user: SN.User, id: MapID) => {
    const query = `
      query AllEdges($id: ID!) {
        allEdges(filter: { map: { id: $id } }) {
          ...edgeFields
        }
      }
      ${graphQLEdgeFieldsFragment}
    `;
    const variables = { id };
    return client(user).request(query, variables)
      .then(({ allEdges }) => allEdges.map(toEdge));
  };

export const create =
  (user: SN.User, map: MapID, from: ObjectID, to: ObjectID) => {
    const query = `
      mutation CreateEdge(
        $map: ID,
        $from: ID,
        $to: ID
      ) {
        createEdge(mapId: $map, fromId: $from, toId: $to) {
          ...edgeFields
        }
      }
      ${graphQLEdgeFieldsFragment}
    `;
    const variables = { map, from, to };
    return client(user).request(query, variables)
      .then(({ createEdge }) => toEdge(createEdge));
  };

export const remove =
  (user: SN.User, edge: EdgeID) => {
    const query = `
      mutation DeleteEdge($edge: ID!) {
        deleteEdge(id: $edge) {
          id
        }
      }
    `;
    const variables = { edge };
    return client(user).request(query, variables);
  };
