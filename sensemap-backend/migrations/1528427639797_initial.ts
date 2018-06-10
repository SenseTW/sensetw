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
  string: {
    type: 'varchar(255)',
    notNull: true,
    default: ''
  },
  coordinate: {
    type: 'double precision',
    notNull: true,
    default: 0,
  },
};

export const up = (pgm: MigrationBuilder) => {
  pgm.createExtension('uuid-ossp');
  pgm.createTable('map', {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  }, {
    comment: 'Map data',
  });

  pgm.createType('cardtype', ['NORMAL', 'QUESTION', 'ANSWER', 'NOTE']);
  pgm.createTable('card', {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    title: 'string',
    summary: 'string',
    description: 'string',
    tags: 'string',
    saidBy: 'string',
    stakeholder: 'string',
    url: 'string',
    cardType: {
      type: 'cardtype',
      notNull: true,
      default: 'NORMAL',
    },
    mapId: 'mapReference',
  }, {
    'comment': 'Card data',
  });
  pgm.createIndex('card', ['mapId']);

  pgm.createTable('box', {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    title: 'string',
    summary: 'string',
    tags: 'string',
    mapId: 'mapReference',
  }, {
    comment: 'Box data',
  });
  pgm.createIndex('box', ['mapId']);

  pgm.createType('objecttype', ['NONE', 'CARD', 'BOX']);
  pgm.createTable('object', {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    mapId: 'mapReference',
    x: 'coordinate',
    y: 'coordinate',
    zIndex: {
      type: 'integer',
      notNull: true,
      default: 0,
    },
    objectType: {
      type: 'objecttype',
      notNull: true,
    },
    boxId: 'boxReference',
    cardId: 'cardReference',
    belongsToId: 'boxReference',
  }, {
    comment: 'Object data',
  });
  pgm.createIndex('object', ['mapId', 'objectType']);
  pgm.createIndex('object', ['cardId']);
  pgm.createIndex('object', ['boxId']);
  pgm.createIndex('object', ['belongsToId']);

  pgm.createTable('edge', {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    mapId: 'mapReference',
    fromId: 'objectReference',
    toId: 'objectReference',
  }, {
    comment: 'Edge data',
  });
  pgm.createIndex('edge', ['mapId', 'fromId']);
  pgm.createIndex('edge', ['mapId', 'toId']);
};

// auto down migration
//export const down = (pgm: MigrationBuilder) => {};
