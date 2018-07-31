import * as Knex from "knex";

exports.seed = function (knex: Knex): Promise<any> {
  return knex('map').del()
    .then(() => knex('map').insert([
      {
        id: 'b2f73daf-e767-4d8d-9506-52589d4fd039',
        name: 'foobar',
        description: 'This is a foobar map.',
        tags: 'foo,bar',
        image: 'example.gif',
        type: 'sometype',
        ownerId: 'dd776858-52f4-48b4-b40c-2b9330409513',
      },
      { id: '63a544b6-36cf-4344-b370-32d451a35b70' },
    ]));
};
