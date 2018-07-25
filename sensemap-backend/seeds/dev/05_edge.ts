import * as Knex from "knex";

exports.seed = function (knex: Knex): Promise<any> {
  return knex('edge').insert([
    {
      id: '041c1000-5af7-458a-97f5-e7a748021882',
      mapId: 'b2f73daf-e767-4d8d-9506-52589d4fd039',
      fromId: '8f479cad-50a1-4604-92cd-df60b0291b9e',
      toId: '4fb35a07-176f-484e-a93d-a9c8d4edc3f3',
    },
  ]);
};
