import { MigrationBuilder } from 'node-pg-migrate';

export const shorthands = {
  text: {
    type: 'text',
    notNull: true,
    default: '',
  },
};

export const up = (pgm: MigrationBuilder) => {
  pgm.addColumn('card', {
    quote: 'text',
  });
};

// export const down = (pgm: MigrationBuilder) => { };
