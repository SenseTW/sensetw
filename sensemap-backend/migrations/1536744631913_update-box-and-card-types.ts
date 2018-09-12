import { MigrationBuilder } from 'node-pg-migrate';

// export const shorthands = {};

export const up = (pgm: MigrationBuilder) => {
  pgm.createType('cardtype2', ['NORMAL', 'QUESTION', 'ANSWER', 'NOTE', 'PROBLEM', 'SOLUTION', 'DEFINITION', 'INFO']);
  // drop default and migrate to the new enum
  pgm.alterColumn('card', 'cardType', {
    type: 'cardtype2',
    default: null,
    using: '"cardType"::text::cardtype2',
  });
  pgm.dropType('cardtype');
  pgm.renameType('cardtype2', 'cardtype');
  pgm.alterColumn('card', 'cardType', {
    type: 'cardtype',
    notNull: true,
    default: 'NOTE'
  });

  pgm.createType('boxtype', ['NOTE', 'PROBLEM', 'SOLUTION', 'DEFINITION', 'INFO']);
  pgm.addColumns('box', {
    boxType: {
      type: 'boxtype',
      notNull: true,
      default: 'NOTE',
    },
  });
};

export const down = (pgm: MigrationBuilder) => {
  pgm.createType('cardtype2', ['NORMAL', 'QUESTION', 'ANSWER', 'NOTE']);
  // alter new card types to old card types
  pgm.alterColumn('card', 'cardType', {
    type: 'cardtype2',
    default: null,
    using: `(
      CASE "cardType"::text
        WHEN 'PROBLEM' THEN 'NORMAL'
        WHEN 'SOLUTION' THEN 'NORMAL'
        WHEN 'DEFINITION' THEN 'NORMAL'
        WHEN 'INFO' THEN 'NORMAL'
        ELSE "cardType"::text
      END
    )::cardtype2`,
  });
  pgm.dropType('cardtype');
  pgm.renameType('cardtype2', 'cardtype');
  pgm.alterColumn('card', 'cardType', {
    type: 'cardtype',
    notNull: true,
    default: 'NORMAL',
  });

  pgm.dropColumns('box', ['boxType']);
  pgm.dropType('boxtype');
};
