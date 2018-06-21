import { MigrationBuilder } from 'node-pg-migrate';

export const shorthands = {
  length: {
    type: 'double precision',
    notNull: false,
    default: 0,
  }
};

export const up = (pgm: MigrationBuilder) => {
  pgm.addColumns('object', {
    width: 'length',
    height: 'length',
  });
};

//export const down = (pgm: MigrationBuilder) => {};
