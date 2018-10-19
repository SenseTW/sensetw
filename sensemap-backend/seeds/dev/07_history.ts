import * as Knex from "knex";

exports.seed = async function(knex: Knex): Promise<any> {
  await knex("history").insert({
    userId: "dd776858-52f4-48b4-b40c-2b9330409513",
    historyType: "MAP",
    mapId: "b2f73daf-e767-4d8d-9506-52589d4fd039",
    objectId: null,
    data: {
      operation: "CREATE",
    },
  });

  await knex("history").insert({
    userId: "dd776858-52f4-48b4-b40c-2b9330409513",
    historyType: "MAP",
    mapId: "b2f73daf-e767-4d8d-9506-52589d4fd039",
    objectId: null,
    data: {
      operation: "ADD_CARD",
      target: "09f3bf62-7658-4b3e-aec0-559b55c033a6",
    },
  });

  await knex("history").insert({
    userId: "dd776858-52f4-48b4-b40c-2b9330409513",
    historyType: "MAP",
    mapId: "b2f73daf-e767-4d8d-9506-52589d4fd039",
    objectId: null,
    data: {
      operation: "DELETE_CARD",
      target: "09f3bf62-7658-4b3e-aec0-559b55c033a6",
    },
  });

  await knex("history").insert({
    userId: "dd776858-52f4-48b4-b40c-2b9330409513",
    historyType: "MAP",
    mapId: "b2f73daf-e767-4d8d-9506-52589d4fd039",
    objectId: null,
    data: {
      operation: "ADD_BOX",
      target: "10330ced-04b4-46d3-91a6-1d294bb12da3",
    },
  });

  await knex("history").insert({
    userId: "dd776858-52f4-48b4-b40c-2b9330409513",
    historyType: "MAP",
    mapId: "b2f73daf-e767-4d8d-9506-52589d4fd039",
    objectId: null,
    data: {
      operation: "DELETE_BOX",
      target: "10330ced-04b4-46d3-91a6-1d294bb12da3",
    },
  });

};
