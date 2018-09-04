import { ID, User, UserData, userFields, Map } from './sql';
import * as Knex from 'knex';
import { pick } from 'ramda';
import * as crypto from 'crypto';
import { mapsQuery } from './map';

const token_algorithm = 'aes-256-ctr';

export function usersQuery(db: Knex) {
  return db.select(userFields(db)).from('user');
}

export async function getUser(db: Knex, id: ID): Promise<User | null> {
  const u: User | undefined = await usersQuery(db).where('id', id).first();
  return u === undefined ? null : u;
}

export async function getUserMaps(db: Knex, id: ID): Promise<Map> {
  return mapsQuery(db).where('ownerId', id);
}

type UsernameIdentityClaim = {
  type: 'username',
  username: string,
  password: string,
};

type EmailIdentityClaim = {
  type: 'email',
  email: string,
  password: string,
};

type IdentityClaim = UsernameIdentityClaim | EmailIdentityClaim;

export async function authenticate(db: Knex, claim: IdentityClaim): Promise<User | null> {
  let q = db.select(userFields(db)).from('user')
    .where('salthash', db.raw(`crypt(?, ??)`, [ claim.password, 'salthash' ]))
  if (claim.type === 'username') {
    q = q.andWhere('username', claim.username);
  } else if (claim.type === 'email') {
    q = q.andWhere('email', claim.email);
  }
  const u: User | undefined = await q.first();
  return u === undefined ? null : u;
}

export async function updateUserPassword(db: Knex, id: ID, password: string): Promise<User | null> {
  return db('user').where('id', id).update({
    salthash: db.raw(`crypt(?, gen_salt('bf', 8))`, [ password ]),
  });
}

export async function createUser(db: Knex, args: UserData, password: string): Promise<User> {
  return db.transaction(async (trx) => {
    const fields: UserData = pick(userFields(db), args);
    const rows: User[] = await trx('user').insert({
      ...fields,
      salthash: db.raw(`crypt(?, gen_salt('bf', 8))`, [ password ]),
    }).returning(userFields(db));
    return rows[0];
  });
}

export async function findUserByUsername(db: Knex, username: string): Promise<User | null> {
  const rows = await db.select(userFields(db)).from('user').where('username', username);
  return rows.length > 0 ? rows[0] : null;
}

export async function findUserByEmail(db: Knex, email: string): Promise<User | null> {
  const rows = await db.select(userFields(db)).from('user').where('email', email);
  return rows.length > 0 ? rows[0] : null;
}

export async function deleteUser(db: Knex, id: ID): Promise<User | null> {
  return db('user').where('id', id).delete().returning(userFields(db));
}

export async function updateUser(db: Knex, id: ID, args: User): Promise<User | null> {
  const fields: User = pick(userFields(db), args);
  return db('user').where('id', id).update(fields).returning(userFields(db));
}

export type TokenPayload = {
  id: ID,
  expire?: Date,
  version?: number,
};

// XXX need stronger encryption in the future
export function generate_token(siteSecret: string, payload: TokenPayload): string {
  const expireTimestamp = (payload.expire || new Date()).valueOf() + 86400000 * 365;
  const version = payload.version || 0;
  const cipher = crypto.createCipher(token_algorithm, siteSecret);
  let crypted = cipher.update(`${version}:${payload.id}:${siteSecret}:${expireTimestamp}`, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

export function decrypt_token(siteSecret: string, token: string): TokenPayload {
  const decipher = crypto.createDecipher(token_algorithm, siteSecret);
  let decrypted = decipher.update(token, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  const [ version, id, {}, expireTimestamp ] = decrypted.split(':');
  return { id, version: +version, expire: new Date(expireTimestamp) };
}

export function checkUsername(username: string): string {
  if (username.length < 3 || username.length > 30) {
    return 'Username must be between 3 and 30 characters.'
  }

  const i = username.search(/[^a-zA-Z0-9\._]/);
  if (i >= 0) {
    return 'Username must contain only letters, numbers, periods, and underscores.';
  }

  return '';
}

export function checkPassword(password: string): string {
  if (password.length < 8 || password.length > 16) {
    return 'Password must be between 8 and 16 characters.';
  }

  return '';
}

export const resolvers = {
  Query: {
    User: async (_, args, { db }, info): Promise<User | null> => {
      return getUser(db, args.id);
    },
  },
  User: {
    id:          async (o, _, { db }, info): Promise<ID>            => typeof(o) !== 'string' ? o.id          : o,
    createdAt:   async (o, _, { db }, info): Promise<Date>          => typeof(o) !== 'string' ? o.createdAt   : (await getUser(db, o)).createdAt,
    updatedAt:   async (o, _, { db }, info): Promise<Date>          => typeof(o) !== 'string' ? o.updatedAt   : (await getUser(db, o)).updatedAt,
    username:    async (o, _, { db }, info): Promise<Date>          => typeof(o) !== 'string' ? o.username    : (await getUser(db, o)).username,
    email:       async (o, _, { db }, info): Promise<Date>          => typeof(o) !== 'string' ? o.email       : (await getUser(db, o)).email,
    maps:        async (o, _, { db }, info): Promise<Map[]>         => typeof(o) !== 'string' ? o.maps        : getUserMaps(db, o),
  },
}
