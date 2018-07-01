import { MigrationBuilder, PgLiteral } from 'node-pg-migrate';

export const shorthands = {
  id: {
    type: 'uuid',
    primaryKey: true,
    default: new PgLiteral('uuid_generate_v4()'),
  },
  token: {
    type: 'varchar(64)',
  },
  userReference: {
    type: 'uuid',
    references: '"user"', // XXX bug
  },
};

export const up = (pgm: MigrationBuilder) => {
  pgm.createTable('oauth_authorization_code', {
    id: 'id',
    authorizationCode: 'varchar(64)',
    expiresAt: 'timestamp',
    redirectUri: 'varchar(512)',
    clientId: 'uuid',
    userId: 'userReference',
  });
  pgm.createIndex('oauth_authorization_code', ['authorizationCode']);
  pgm.createIndex('oauth_authorization_code', ['expiresAt']);

  pgm.createTable('oauth_token', {
    id: 'id',
    accessToken: 'token',
    accessTokenExpiresAt: 'timestamp',
    refreshToken: 'token',
    refreshTokenExpiresAt: 'timestamp',
    clientId: 'uuid',
    userId: 'userReference',
  });
  pgm.createIndex('oauth_token', ['accessToken']);
  pgm.createIndex('oauth_token', ['refreshToken']);
  pgm.createIndex('oauth_token', ['accessTokenExpiresAt']);
  pgm.createIndex('oauth_token', ['refreshTokenExpiresAt']);
};

// auto down migration
//export const down = (pgm: MigrationBuilder) => {};
