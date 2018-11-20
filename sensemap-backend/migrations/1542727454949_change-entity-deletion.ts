import { MigrationBuilder } from 'node-pg-migrate';

export const shorthands = {
  deletedAt: {
    type: 'timestamp',
    notNull: false,
  }
};

export const up = (pgm: MigrationBuilder) => {
  pgm.addColumn('map', {
    deletedAt: 'deletedAt',
  });
  pgm.addColumn('object', {
    deletedAt: 'deletedAt',
  });
  pgm.addColumn('card', {
    deletedAt: 'deletedAt',
  });
  pgm.addColumn('box', {
    deletedAt: 'deletedAt',
  });
  pgm.addColumn('edge', {
    deletedAt: 'deletedAt',
  });
};

// export const down = (pgm: MigrationBuilder) => { };
