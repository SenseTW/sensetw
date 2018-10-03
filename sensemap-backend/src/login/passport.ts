import * as passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import * as U from "../types/user";
import { ID, User } from "../types/sql";
import { context } from "../context";

const { db } = context();

passport.use(
  new LocalStrategy(
    {
      usernameField: "email"
    },
    (email, password, done) => {
      return U.authenticate(db, { type: "email", email, password }).then(
        user => {
          if (user === null) {
            return done(null, false, { message: "Invalid user" });
          } else {
            return done(null, user);
          }
        }
      );
    }
  )
);

passport.serializeUser<User, ID>((user, done) => {
  if (!!user.id) {
    return done(null, user.id);
  } else {
    return done("Invalid user: no ID");
  }
});

passport.deserializeUser<User, ID>((id, done) => {
  return U.getUser(db, id).then(u => {
    if (u === null) {
      return done("Invalid user");
    } else {
      return done(null, u);
    }
  });
});

export = require("passport");
