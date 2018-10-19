import { MigrationBuilder, PgLiteral } from 'node-pg-migrate';

export const shorthands = {
  id: {
    type: 'uuid',
    primaryKey: true,
    default: new PgLiteral('uuid_generate_v4()'),
  },
  time: {
    type: 'timestamp',
    notNull: true,
    default: new PgLiteral('current_timestamp'),
  },
  userReference: {
    type: 'uuid',
    notNull: true,
    references: '"user"',
  },
  mapReference: {
    type: 'uuid',
    notNull: true,
    references: 'map',
  },
  objectReference: {
    type: 'uuid',
    references: 'object',
  },
  cardReference: {
    type: 'uuid',
    references: 'card',
  },
  boxReference: {
    type: 'uuid',
    references: 'box',
  },
  edgeReference: {
    type: 'uuid',
    references: 'edge',
  },
};

export const up = (pgm: MigrationBuilder) => {
  pgm.createTable('transaction', {
    id: 'id',
    createdAt: 'time',
    updatedAt: 'time',
    data: {
      type: 'jsonb',
      notNull: true,
    },
  });

  pgm.createType('historytype', ['MAP', 'OBJECT']);
  pgm.createTable('history', {
    id: 'id',
    createdAt: 'time',
    updatedAt: 'time',
    userId: 'userReference',
    historyType: 'historytype',
    mapId: 'mapReference',
    objectId: 'objectReference',
    data: {
      type: 'jsonb',
      notNull: true,
    },
  });
};

// export const down = (pgm: MigrationBuilder) => {};
