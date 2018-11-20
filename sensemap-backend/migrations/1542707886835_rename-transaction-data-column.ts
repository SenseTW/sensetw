import { MigrationBuilder } from 'node-pg-migrate';

export const shorthands = undefined;

export const up = (pgm: MigrationBuilder) => {
  pgm.renameColumn('transaction', 'data', 'payload');
};

// export const down = (pgm: MigrationBuilder) => { };
