import * as Knex from "knex";

exports.seed = function(knex: Knex): Promise<any> {
  return knex("edge")
    .del()
    //.then(() => knex("transaction").del())
    .then(() => knex("history").del())
    .then(() => knex("annotation").del())
    .then(() => knex("object").del())
    .then(() => knex("card").del())
    .then(() => knex("box").del())
    .then(() => knex("map").del())
    .then(() => knex("oauth_authorization_code").del())
    .then(() => knex("oauth_token").del())
    .then(() => knex("user").del());
};
