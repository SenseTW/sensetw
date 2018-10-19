import * as Knex from "knex";

exports.seed = async function(knex: Knex): Promise<any> {
  await knex("edge").del();
  await knex("transaction").del();
  await knex("history").del();
  await knex("annotation").del();
  await knex("object").del();
  await knex("card").del();
  await knex("box").del();
  await knex("map").del();
  await knex("oauth_authorization_code").del();
  await knex("oauth_token").del();
  await knex("user").del();
};
