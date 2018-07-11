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
  mapReference: {
    type: 'uuid',
    notNull: true,
    references: 'map',
  },
  cardReference: {
    type: 'uuid',
    references: 'card',
  },
};

export const up = (pgm: MigrationBuilder) => {
  pgm.createTable('annotation', {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    mapId: 'mapReference',
    cardId: 'cardReference',
    document: {
      type: 'jsonb',
    },
    target: {
      type: 'jsonb',
    },
  });
  pgm.createIndex('annotation', [ 'cardId' ]);
};

// export const down = (pgm: MigrationBuilder) => {};
