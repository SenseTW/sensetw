
import { GraphQLClient } from 'graphql-request';

export const endpoint = 'https://backend.staging.api.sense.tw/graphql';
export const client = new GraphQLClient(endpoint);
