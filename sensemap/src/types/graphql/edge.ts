import { HasID } from '../sense/has-id';
import { MapID } from '../sense-map';
import { ObjectID } from '../sense/object';
import { EdgeID, Edge } from '../sense/edge';
import { client } from './client';

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
  (id: MapID) => {
    const query = `
      query AllEdges($id: ID!) {
        allEdges(filter: { map: { id: $id } }) {
          ...edgeFields
        }
      }
      ${graphQLEdgeFieldsFragment}
    `;
    const variables = { id };
    return client.request(query, variables)
      .then(({ allEdges }) => allEdges.map(toEdge));
  };
