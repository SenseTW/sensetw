import { MigrationBuilder } from 'node-pg-migrate';

export const shorthands = {
  userReference: {
    type: 'uuid',
    references: '"user"',
  },
};

export const up = (pgm: MigrationBuilder) => {
  pgm.addColumn('box', {
    ownerId: 'userReference',
  });
};

// export const down = (pgm: MigrationBuilder) => { };
