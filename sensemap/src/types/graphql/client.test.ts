import * as nock from 'nock';
import { endpoint, client } from './client';

export const nockedAPI =
  nock(endpoint)
    .defaultReplyHeaders({ 'Content-Type': 'application/json' })
    .post('');

describe('GraphQL', () => {
  describe('client', () => {
    it('should be a function', () => {
      expect(typeof client).toBe('function');
    });
  });
});