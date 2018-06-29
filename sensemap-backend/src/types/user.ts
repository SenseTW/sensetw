import { ID, User, UserData, userFields } from './sql';
import * as Knex from 'knex';
import { pick } from 'ramda';
import * as crypto from 'crypto';

const token_algorithm = 'aes-256-ctr';

export async function getUser(db: Knex, id: ID): Promise<User | null> {
  const u: User | undefined = await  db.select(userFields(db)).from('user').where('id', id).first();
  return u === undefined ? null : u;
}

export async function authenticate(db: Knex, username: string, password: string): Promise<User | null> {
  const u: User | undefined = await db.select(userFields(db)).from('user')
    .where('salthash', db.raw(`crypt(?, ??)`, [ password, 'salthash' ]))
    .andWhere('username', username)
    .returning(userFields(db))
    .first();
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
  return db.select(userFields(db)).from('user').where('username', username);
}

export async function findUserByEmail(db: Knex, email: string): Promise<User | null> {
  return db.select(userFields(db)).from('user').where('email', email);
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
  const [ version, id, _, expireTimestamp ] = decrypted.split(':');
  return { id, version: +version, expire: new Date(expireTimestamp) };
}
