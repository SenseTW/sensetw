import { User } from './sql';
import { getUser } from './user';

export const resolvers = {
  Query: {
    Profile: async (_, args, { db, user }, info): Promise<User | null> => {
      if (!user) {
        return null;
      }
      return getUser(db, user.id);
    },
  },
}
