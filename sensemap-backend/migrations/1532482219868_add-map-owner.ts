import { MigrationBuilder } from 'node-pg-migrate';

export const shorthands = {
  userReference: {
    type: 'uuid',
    references: '"user"',
  },
};

export const up = (pgm: MigrationBuilder) => {
  pgm.addColumns('map', {
    ownerId: 'userReference',
  });
};

// export const down = (pgm: MigrationBuilder) => { };
