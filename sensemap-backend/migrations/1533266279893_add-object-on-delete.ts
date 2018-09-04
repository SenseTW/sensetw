import { MigrationBuilder } from 'node-pg-migrate';

export const shorthands = undefined;

export const up = (pgm: MigrationBuilder) => {
  pgm.dropConstraint('edge', 'edge_fromId_fkey');
  pgm.addConstraint('edge', 'edge_fromId_fkey', {
    foreignKeys: [
      {
        columns: 'fromId',
        references: 'object(id)',
        onDelete: 'CASCADE',
      },
    ],
  });

  pgm.dropConstraint('edge', 'edge_toId_fkey');
  pgm.addConstraint('edge', 'edge_toId_fkey', {
    foreignKeys: [
      {
        columns: 'toId',
        references: 'object(id)',
        onDelete: 'CASCADE',
      },
    ],
  });
};

// export const down = (pgm: MigrationBuilder) => { };
