
import { GraphQLClient } from 'graphql-request';
import { sanitizeURL } from '../utils';

export const endpoint
  = process.env.REACT_APP_SENSEMAP_GRAPHQL_ROOT
      ? sanitizeURL(process.env.REACT_APP_SENSEMAP_GRAPHQL_ROOT)
      : process.env.REACT_APP_SENSEMAP_API_ROOT
          ? `${sanitizeURL(process.env.REACT_APP_SENSEMAP_API_ROOT)}/graphql`
          : 'https://api.sense.tw/graphql';

export const client = new GraphQLClient(endpoint);
