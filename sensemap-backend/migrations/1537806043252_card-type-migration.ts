import { MigrationBuilder } from 'node-pg-migrate';

// export const shorthands = {};

export const up = (pgm: MigrationBuilder) => {
  pgm.createType('cardtype2', ['NOTE', 'PROBLEM', 'SOLUTION', 'DEFINITION', 'INFO']);
  // drop default and migrate to the new enum
  pgm.alterColumn('card', 'cardType', {
    type: 'cardtype2',
    default: null,
    using: `(
      CASE "cardType"::text
        WHEN 'QUESTION' THEN 'PROBLEM'
        WHEN 'ANSWER' THEN 'SOLUTION'
        WHEN 'NORMAL' THEN 'INFO'
        ELSE "cardType"::text
      END
    )::cardtype2`,
  });
  pgm.dropType('cardtype');
  pgm.renameType('cardtype2', 'cardtype');
  pgm.alterColumn('card', 'cardType', {
    type: 'cardtype',
    notNull: true,
    default: 'INFO',
  });

  pgm.alterColumn('box', 'boxType', {
    default: 'INFO',
  });
};

export const down = (pgm: MigrationBuilder) => {
  pgm.createType('cardtype2', ['NORMAL', 'QUESTION', 'ANSWER', 'NOTE', 'PROBLEM', 'SOLUTION', 'DEFINITION', 'INFO']);
  // drop default and migrate to the new enum
  pgm.alterColumn('card', 'cardType', {
    type: 'cardtype2',
    default: null,
    using: `(
      CASE "cardType"::text
        WHEN 'PROBLEM' THEN 'QUESTION'
        WHEN 'SOLUTION' THEN 'ANSWER'
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
    default: 'NOTE',
  });

  pgm.alterColumn('box', 'boxType', {
    default: 'NOTE',
  });
};
