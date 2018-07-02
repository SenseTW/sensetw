import { MigrationBuilder } from 'node-pg-migrate';

export const shorthands = {
  'string': {
    type: 'varchar(255)',
  }
};

export const up = (pgm: MigrationBuilder) => {
  pgm.addColumns('map', {
    type: 'string',
  });
  pgm.createIndex('map', [ 'type' ]);
};

// export const down = (pgm: MigrationBuilder) => {};
