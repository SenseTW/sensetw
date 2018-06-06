import { MigrationBuilder, PgLiteral } from 'node-pg-migrate';

export const shorthands = {
  id: {
    type: 'uuid',
    primaryKey: true,
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
    map: 'mapReference',
  }, {
    'comment': 'Card data',
  });
  pgm.createIndex('card', ['map']);

  pgm.createTable('box', {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    title: 'string',
    summary: 'string',
    tags: 'string',
    map: 'mapReference',
  }, {
    comment: 'Box data',
  });
  pgm.createIndex('box', ['map']);

  pgm.createType('objecttype', ['NONE', 'CARD', 'BOX']);
  pgm.createTable('object', {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    map: 'mapReference',
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
    box: 'boxReference',
    card: 'cardReference',
    belongsTo: 'boxReference',
  }, {
    comment: 'Object data',
  });
  pgm.createIndex('object', ['map', 'objectType']);
  pgm.createIndex('object', ['card']);
  pgm.createIndex('object', ['box']);
  pgm.createIndex('object', ['belongsTo']);

  pgm.createTable('edge', {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    map: 'mapReference',
    from: 'objectReference',
    to: 'objectReference',
  }, {
    comment: 'Edge data',
  });
  pgm.createIndex('edge', ['map', 'from']);
  pgm.createIndex('edge', ['map', 'to']);
};

// auto down migration
//export const down = (pgm: MigrationBuilder) => {};
