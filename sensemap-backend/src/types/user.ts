import { gql } from "apollo-server";
import { ID, User, UserData, userFields, Map } from "./sql";
import * as Knex from "knex";
import { pick } from "ramda";
import { mapsQuery } from "./map";
import * as A from "./oauth";

export function usersQuery(db: Knex) {
  return db.select(userFields(db)).from("user");
}

export async function getUser(db: Knex, id: ID): Promise<User | null> {
  const u: User | undefined = await usersQuery(db)
    .where("id", id)
    .first();
  return u === undefined ? null : u;
}

export async function getUserMaps(db: Knex, id: ID): Promise<Map> {
  return mapsQuery(db).where("ownerId", id);
}

type UsernameIdentityClaim = {
  type: "username";
  username: string;
  password: string;
};

type EmailIdentityClaim = {
  type: "email";
  email: string;
  password: string;
};

type IdentityClaim = UsernameIdentityClaim | EmailIdentityClaim;

export async function authenticate(
  db: Knex,
  claim: IdentityClaim
): Promise<User | null> {
  let q = db
    .select(userFields(db))
    .from("user")
    .where("salthash", db.raw(`crypt(?, ??)`, [claim.password, "salthash"]));
  if (claim.type === "username") {
    q = q.andWhere("username", claim.username);
  } else if (claim.type === "email") {
    q = q.andWhere("email", claim.email);
  }
  const u: User | undefined = await q.first();
  return u === undefined ? null : u;
}

async function verifyUserPassword(
  db: Knex,
  id: ID,
  password: string
): Promise<User | null> {
  const q = db
    .select(userFields(db))
    .from("user")
    .where("salthash", db.raw(`crypt(?, ??)`, [password, "salthash"]))
    .andWhere("id", id);
  const u: User | undefined = await q.first();
  return u === undefined ? null : u;
}

export async function updateUserPassword(
  db: Knex,
  id: ID,
  password: string
): Promise<User | null> {
  const rows: User[] = await db("user")
    .where("id", id)
    .update({
      salthash: db.raw(`crypt(?, gen_salt('bf', 8))`, [password])
    })
    .returning(userFields(db));
  return rows.length > 0 ? rows[0] : null;
}

export async function createUser(
  db: Knex,
  args: UserData,
  password: string
): Promise<User> {
  return db.transaction(async trx => {
    const fields: UserData = pick(userFields(db), args);
    const rows: User[] = await trx("user")
      .insert({
        ...fields,
        salthash: db.raw(`crypt(?, gen_salt('bf', 8))`, [password])
      })
      .returning(userFields(db));
    return rows[0];
  });
}

export async function findUserByUsername(
  db: Knex,
  username: string
): Promise<User | null> {
  const rows = await db
    .select(userFields(db))
    .from("user")
    .where("username", username);
  return rows.length > 0 ? rows[0] : null;
}

export async function findUserByEmail(
  db: Knex,
  email: string
): Promise<User | null> {
  const rows = await db
    .select(userFields(db))
    .from("user")
    .where("email", email);
  return rows.length > 0 ? rows[0] : null;
}

export async function deleteUser(db: Knex, id: ID): Promise<User | null> {
  return db("user")
    .where("id", id)
    .delete()
    .returning(userFields(db));
}

export async function updateUser(
  db: Knex,
  id: ID,
  args: User
): Promise<User | null> {
  const fields: User = pick(userFields(db), args);
  return db("user")
    .where("id", id)
    .update(fields)
    .returning(userFields(db));
}

export type TokenPayload = {
  id: ID;
  expire?: Date;
  version?: number;
};

export function checkUsername(username: string): string {
  if (username.length < 3 || username.length > 30) {
    return "Username must be between 3 and 30 characters.";
  }

  const i = username.search(/[^a-zA-Z0-9\._]/);
  if (i >= 0) {
    return "Username must contain only letters, numbers, periods, and underscores.";
  }

  return "";
}

export function checkPassword(password: string): string {
  if (password.length < 8 || password.length > 16) {
    return "Password must be between 8 and 16 characters.";
  }

  return "";
}

type ResetPasswordToken = {
  userId: ID;
  token: string;
};

const resetPasswordTokenFields = ["userId", "token"];

function resetPasswordTokenQuery(db: Knex) {
  return db
    .select(resetPasswordTokenFields)
    .from("reset_password_token")
    .whereRaw(`"createdAt" >= (current_timestamp - interval '1 day')`);
}

export async function clearOutdatedResetPasswordTokens(db: Knex) {
  return db("reset_password_token")
    .whereRaw(`"createdAt" < (current_timestamp - interval '1 day')`)
    .del();
}

export async function clearResetPasswordTokensForUser(db: Knex, id: ID) {
  return db("reset_password_token")
    .where("userId", id)
    .del();
}

export async function createResetPasswordToken(
  db: Knex,
  id: ID
): Promise<ResetPasswordToken> {
  const rows = await db("reset_password_token")
    .insert({
      userId: id,
      token: db.raw(`encode(gen_random_bytes(32), 'hex')`)
    })
    .returning(resetPasswordTokenFields);
  return rows[0];
}

export async function findUserByResetPasswordToken(
  db: Knex,
  token: string
): Promise<User | null> {
  const t = await resetPasswordTokenQuery(db)
    .where("token", token)
    .first();
  if (!t) {
    return null;
  }
  return getUser(db, t.userId);
}

export const typeDefs = [
  gql`
    extend type Query {
      User(id: ID): User
      verifyPassword(password: String): User
    }

    extend type Mutation {
      changePassword(password: String): User
    }

    type User @model {
      id: ID! @isUnique
      createdAt: DateTime!
      updatedAt: DateTime!
      username: String!
      email: String
      maps: [Map!]! @relation(name: "MapOwners")
    }
  `
];

export const resolvers = {
  Query: {
    User: async (_, args, { db }, info): Promise<User | null> => {
      return getUser(db, args.id);
    },
    verifyPassword: async (
      _,
      { password },
      { db, authorization },
      info
    ): Promise<User | null> => {
      const u = await A.getUserFromAuthorization(db, authorization);
      if (!u) {
        return null;
      }
      return await verifyUserPassword(db, u.id, password);
    }
  },
  Mutation: {
    changePassword: async (
      _,
      { password },
      { db, authorization },
      info
    ): Promise<User | null> => {
      const u = await A.getUserFromAuthorization(db, authorization);
      if (!u) {
        return null;
      }
      return await updateUserPassword(db, u.id, password);
    }
  },
  User: {
    id: async (o, _, { db }, info): Promise<ID> =>
      typeof o !== "string" ? o.id : o,
    createdAt: async (o, _, { db }, info): Promise<Date> =>
      typeof o !== "string" ? o.createdAt : (await getUser(db, o)).createdAt,
    updatedAt: async (o, _, { db }, info): Promise<Date> =>
      typeof o !== "string" ? o.updatedAt : (await getUser(db, o)).updatedAt,
    username: async (o, _, { db }, info): Promise<Date> =>
      typeof o !== "string" ? o.username : (await getUser(db, o)).username,
    email: async (o, _, { db }, info): Promise<Date> =>
      typeof o !== "string" ? o.email : (await getUser(db, o)).email,
    maps: async (o, _, { db }, info): Promise<Map[]> =>
      typeof o !== "string" ? o.maps : getUserMaps(db, o)
  }
};
