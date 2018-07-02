import { MigrationBuilder } from 'node-pg-migrate';

export const shorthands = {
  'string': {
    type: 'varchar(255)',
  }
};

export const up = (pgm: MigrationBuilder) => {
  pgm.addColumns('map', {
    name: 'string',
    description: 'string',
    tags: 'string',
    image: 'string',
  });
  pgm.createIndex('map', [ 'name' ]);
};

// export const down = (pgm: MigrationBuilder) => {};
