import { MigrationBuilder } from 'node-pg-migrate';

export const shorthands = {
  transactionReference: {
    type: 'uuid',
    references: 'transaction',
  },
};

export const up = (pgm: MigrationBuilder) => {
  pgm.addColumn('history', {
    transactionId: 'transactionReference'
  });
};

// export const down = (pgm: MigrationBuilder) => { };
