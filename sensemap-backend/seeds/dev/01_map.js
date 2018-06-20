
exports.seed = function(knex, Promise) {
  return knex('map').del()
    .then(function () {
      return knex('map').insert([
        { id: 'b2f73daf-e767-4d8d-9506-52589d4fd039' },
        { id: '63a544b6-36cf-4344-b370-32d451a35b70' },
      ]);
    });
};
