import { MigrationBuilder } from 'node-pg-migrate';

export const shorthands = undefined;

const mapId = '1dbab857-942d-41d0-baa1-82fa70b0d773';

export const up = (pgm: MigrationBuilder) => {
  pgm.sql(`INSERT INTO map (id) VALUES ('{mapId}')`, { mapId });
};

export const down = (pgm: MigrationBuilder) => {
  pgm.sql(`DELETE FROM edge WHERE "mapId" = '{mapId}'`, { mapId });
  pgm.sql(`DELETE FROM object WHERE "mapId" = '{mapId}'`, { mapId });
  pgm.sql(`DELETE FROM card WHERE "mapId" = '{mapId}'`, { mapId });
  pgm.sql(`DELETE FROM box WHERE "mapId" = '{mapId}'`, { mapId });
  pgm.sql(`DELETE FROM map WHERE "id" = '{mapId}'`, { mapId });
};
