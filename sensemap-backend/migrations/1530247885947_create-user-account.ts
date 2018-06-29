import { MigrationBuilder, PgLiteral } from 'node-pg-migrate';

export const shorthands = {
  id: {
    type: 'uuid',
    primaryKey: true,
    default: new PgLiteral('uuid_generate_v4()'),
  },
  createdAt: {
    type: 'timestamp',
    notNull: true,
    default: new PgLiteral('current_timestamp'),
  },
  updatedAt: {
    type: 'timestamp',
    notNull: true,
    default: new PgLiteral('current_timestamp'),
  },
};

export const up = (pgm: MigrationBuilder) => {
  pgm.createExtension('pgcrypto');
  pgm.createTable('user', {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    username: {
      type: 'varchar(32)',
      notNull: true,
      unique: true,
    },
    salthash: {
      type: 'varchar(64)',
      notNull: true,
    },
    email: {
      type: 'varchar(128)',
      notNull: true,
      unique: true,
    }
  });
  pgm.createIndex('user', ['username']);
  pgm.createIndex('user', ['email']);
};

// auto
//export const down = (pgm: MigrationBuilder) => {};
