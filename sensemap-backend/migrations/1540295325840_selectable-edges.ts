import { MigrationBuilder } from 'node-pg-migrate';

export const shorthands = {
  'unlimited': {
    type: 'text',
    notNull: true,
    default: '',
  },
  'limited': {
    type: 'varchar(150)',
    notNull: true,
    default: '',
  },
};

export const up = (pgm: MigrationBuilder) => {
  pgm.createType('edgetype', ['NONE', 'DIRECTED', 'REVERSED', 'BIDIRECTED']);
  pgm.addColumns('edge', {
    edgeType: { type: 'edgetype', notNull: true, default: 'NONE' },
    title: 'unlimited',
    tags: 'unlimited',
    summary: 'limited',
  });
};

// export const down = (pgm: MigrationBuilder) => {};
