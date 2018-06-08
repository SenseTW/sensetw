import { resolvers } from '.';

test('ping', () => {
  expect(resolvers.Query.ping()).toBe('pong');
});
