import { MigrationBuilder } from 'node-pg-migrate';

export const shorthands = undefined;

export const up = (pgm: MigrationBuilder) => {
  pgm.alterColumn('card', 'description', {
    type: 'text',
    notNull: true,
    default: '',
  });
};

export const down = (pgm: MigrationBuilder) => {
  pgm.alterColumn('card', 'description', {
    type: 'varchar(255)',
    notNull: true,
    default: '',
  });
};
