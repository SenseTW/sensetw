import * as Knex from "knex";

exports.seed = function (knex: Knex): Promise<any> {
  return knex('annotation').insert({
    id: '65524a44-7346-46c3-b04a-6a00836d8feb',
    mapId: 'b2f73daf-e767-4d8d-9506-52589d4fd039',
    cardId: '09f3bf62-7658-4b3e-aec0-559b55c033a6',
    target: '[{"source": "https://example.com/", "selector": [{"type": "FragmentSelector", "value": "content", "conformsTo": "https://tools.ietf.org/html/rfc3236"}]}]',
  });
};
