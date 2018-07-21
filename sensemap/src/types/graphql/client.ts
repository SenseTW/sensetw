
import { GraphQLClient } from 'graphql-request';

function noSlash(a: string): string {
    return a.replace(/\/+$/, '');
  }

export const endpoint = noSlash(process.env.REACT_APP_SENSEMAP_API_ROOT || 'https://api.sense.tw/graphql');
export const client = new GraphQLClient(endpoint);
