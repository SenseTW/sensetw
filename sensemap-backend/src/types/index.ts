import { gql, IResolvers } from 'apollo-server';
import { reduce, mergeDeepRight } from 'ramda';
import * as U from './user';
import * as M from './map';
import * as O from './object';
import * as E from './edge';
import * as C from './card';
import * as B from './box';

export const typeDefs = [
  gql`
    scalar DateTime

    type Query {
      ping: String
    }

    type Mutation {
      noop: String
    }
  `,
  ...U.typeDefs,
  ...M.typeDefs,
  ...O.typeDefs,
  ...E.typeDefs,
  ...C.typeDefs,
  ...B.typeDefs,
];

export const resolvers =
  reduce(
    mergeDeepRight,
    {
      Query: { ping: () => 'pong' },
      Mutation: { noop: () => null },
    },
    [
      U.resolvers,
      M.resolvers,
      O.resolvers,
      E.resolvers,
      C.resolvers,
      B.resolvers,
    ]
  ) as IResolvers<any, any>;
