import { MigrationBuilder, PgLiteral } from 'node-pg-migrate';

export const shorthands = {
  id: {
    type: 'bigserial',
    primaryKey: true,
  },
  token: {
    type: 'varchar(64)',
    notNull: true,
    unique: true,
  },
  userReference: {
    type: 'uuid',
    references: '"user"',
  },
  createdAt: {
    type: 'timestamp',
    notNull: true,
    default: new PgLiteral('current_timestamp'),
  },
};

export const up = (pgm: MigrationBuilder) => {
  pgm.createTable('reset_password_token', {
    id: 'id',
    userId: 'userReference',
    token: 'token',
    createdAt: 'createdAt',
  });
  pgm.createIndex('reset_password_token', ['userId']);
  pgm.createIndex('reset_password_token', ['token']);
  pgm.createIndex('reset_password_token', ['createdAt']);

  pgm.dropConstraint('reset_password_token', 'reset_password_token_userId_fkey');
  pgm.addConstraint('reset_password_token', 'reset_password_token_userId_fkey', {
    foreignKeys: [
      {
        columns: 'userId',
        references: '"user"(id)',
        onDelete: 'CASCADE',
      },
    ],
  });
};

export const down = (pgm: MigrationBuilder) => {
  pgm.dropConstraint('reset_password_token', 'reset_password_token_userId_fkey');
  pgm.dropTable('reset_password_token');
};
