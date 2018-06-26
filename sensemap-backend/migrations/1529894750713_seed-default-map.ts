import { MigrationBuilder } from 'node-pg-migrate';

export const shorthands = undefined;

export const up = (pgm: MigrationBuilder) => {
  pgm.sql(`INSERT INTO map (id) VALUES ('{mapId}')`, {
    mapId: '1dbab857-942d-41d0-baa1-82fa70b0d773',
  });
};

export const down = (pgm: MigrationBuilder) => {
  // noop
};
