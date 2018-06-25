
exports.seed = function(knex, Promise) {
  return knex('edge').del()
    .then(function () {
      return knex('object').del();
    })
    .then(function () {
      return knex('card').del();
    })
    .then(function () {
      return knex('box').del();
    })
    .then(function () {
      return knex('map').del();
    });
};
