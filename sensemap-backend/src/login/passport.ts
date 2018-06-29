import * as passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import * as U from '../types/user';
import { ID, User } from '../types/sql';
import { context } from '../context';

const { db } = context({ req: null });

const fakeUser = {
  id: '1337',
  createdAt: new Date(),
  updatedAt: new Date(),
  username: 'hychen',
  password: '3ense',
  email: 'hychen@earth',
};

passport.use(
  new LocalStrategy((username, password, done) => {
    if (username === fakeUser.username && password === fakeUser.password) {
      return done(null, fakeUser);
    }
    return U.authenticate(db, username, password)
      .then(user => {
        if (user === null) {
          return done(null, false, { message: 'Invalid user' })
        } else {
          return done(null, user);
        }
      });
  })
);

passport.serializeUser<User, ID>((user, done) => {
  if (!!user.id) {
    return done(null, user.id);
  } else {
    return done('Invalid user: no ID')
  }
});

passport.deserializeUser<User, ID>((id, done) => {
  if (id === fakeUser.id) {
    return done(null, fakeUser);
  } else {
    return U.getUser(db, id).then(u => {
      if (u === null) {
        return done('Invalid user');
      } else {
        return done(null, u);
      }
    });
  }
});

export = require('passport');
