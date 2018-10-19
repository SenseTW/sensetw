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
    notNull: false,
    references: '"user"',
  },
  mapReference: {
    type: 'uuid',
    notNull: true,
    references: 'map',
    onDelete: 'CASCADE',
  },
  objectReference: {
    type: 'uuid',
    references: 'object',
    onDelete: 'CASCADE',
  },
  cardReference: {
    type: 'uuid',
    references: 'card',
    onDelete: 'CASCADE',
  },
  boxReference: {
    type: 'uuid',
    references: 'box',
    onDelete: 'CASCADE',
  },
  edgeReference: {
    type: 'uuid',
    references: 'edge',
    onDelete: 'CASCADE',
  },
};

export const up = (pgm: MigrationBuilder) => {
  pgm.createTable('transaction', {
    id: 'id',
    createdAt: 'time',
    updatedAt: 'time',
    userId: 'userReference',
    data: {
      type: 'jsonb',
      notNull: true,
    },
  });

  pgm.createType('historytype', ['MAP', 'OBJECT', 'CARD']);
  pgm.createTable('history', {
    id: 'id',
    createdAt: 'time',
    updatedAt: 'time',
    userId: 'userReference',
    historyType: 'historytype',
    mapId: 'mapReference',
    objectId: 'objectReference',
    cardId: 'cardReference',
    data: {
      type: 'jsonb',
      notNull: true,
    },
  });
};

// export const down = (pgm: MigrationBuilder) => {};
