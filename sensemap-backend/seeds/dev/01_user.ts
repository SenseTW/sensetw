import * as Knex from "knex";

exports.seed = function (knex: Knex): Promise<any> {
  return knex('user').del()
    .then(() => knex('user').insert([
      {
        id: 'dd776858-52f4-48b4-b40c-2b9330409513',
        username: 'hello',
        email: 'hello@somewhere',
        salthash: '',
      },
    ]));
};

