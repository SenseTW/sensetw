import { HasID } from '../sense/has-id';
import { MapID } from '../sense/map';
import { ObjectID } from '../sense/object';
import { EdgeID, Edge, EdgeType } from '../sense/edge';
import { client } from './client';
import * as SN from '../session';

const graphQLEdgeFieldsFragment = `
  fragment edgeFields on Edge {
    id, map { id }, from { id }, to { id }, edgeType, title, tags, summary
  }`;

interface GraphQLEdgeFields {
  id:       EdgeID;
  map:      HasID<MapID>;
  from:     HasID<ObjectID>;
  to:       HasID<ObjectID>;
  edgeType: string;
  title:    string;
  tags:     string;
  summary:  string;
}

const toEdge: (e: GraphQLEdgeFields) => Edge =
  e => ({
    id:       e.id,
    map:      e.map.id,
    from:     e.from.id,
    to:       e.to.id,
    edgeType: e.edgeType as EdgeType || EdgeType.NONE,
    title:    e.title || '',
    tags:     e.tags || '',
    summary:  e.summary || '',
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

export const loadById =
  (user: SN.User, ids: EdgeID[]) => {
    if (ids.length === 0) {
      return Promise.resolve([]);
    }
    const query = `
      query {
        ${ids.map((id, i) =>
          `edge_${i}: Edge(id: "${id}") {
            ...edgeFields
          }`
        )}
      }
      ${graphQLEdgeFieldsFragment}
    `;
    return client(user).request(query)
      .then(data => Object.values(data))
      .then(data => data.map(toEdge));
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

export const update =
  (edge: Edge) => {
    const query = `
      mutation UpdateEdge(
        $id: ID!,
        $map: ID,
        $from: ID,
        $to: ID,
        $edgeType: EdgeType,
        $title: String,
        $tags: String,
        $summary: String
      ) {
        updateEdge(
          id: $id,
          mapId: $map,
          fromId: $from,
          toId: $to,
          edgeType: $edgeType,
          title: $title,
          tags: $tags,
          summary: $summary
        ) {
          ...edgeFields
        }
      }
      ${graphQLEdgeFieldsFragment}
    `;
    const variables = edge;
    return client().request(query, variables)
      .then(({ updateEdge }) => toEdge(updateEdge));
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
