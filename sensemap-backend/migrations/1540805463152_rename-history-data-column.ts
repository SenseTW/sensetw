import { MigrationBuilder } from 'node-pg-migrate';

export const shorthands = {
  'transactionReference': {
    type: 'uuid',
    references: 'transaction',
    notNull: true,
  },
};

export const up = (pgm: MigrationBuilder) => {
  pgm.renameColumn('history', 'data', 'changes');
};

// export const down = (pgm: MigrationBuilder) => {};
