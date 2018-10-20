import * as Knex from "knex";

exports.seed = async function(knex: Knex): Promise<any> {

  await knex("history").insert({
    userId: "dd776858-52f4-48b4-b40c-2b9330409513",
    historyType: "MAP",
    mapId: "b2f73daf-e767-4d8d-9506-52589d4fd039",
    cardId: null,
    objectId: null,
    data: {
      op: "CREATE_MAP",
    },
  });

  await knex("history").insert({
    userId: "dd776858-52f4-48b4-b40c-2b9330409513",
    historyType: "CARD",
    mapId: "b2f73daf-e767-4d8d-9506-52589d4fd039",
    cardId: "09f3bf62-7658-4b3e-aec0-559b55c033a6",
    objectId: null,
    data: {
      op: "CREATE_CARD",
    },
  });

  await knex("history").insert({
    userId: "dd776858-52f4-48b4-b40c-2b9330409513",
    historyType: "OBJECT",
    mapId: "b2f73daf-e767-4d8d-9506-52589d4fd039",
    cardId: "09f3bf62-7658-4b3e-aec0-559b55c033a6",
    objectId: "8f479cad-50a1-4604-92cd-df60b0291b9e",
    data: {
      op: "CREATE_OBJECT",
    },
  });

  await knex("history").insert({
    userId: "dd776858-52f4-48b4-b40c-2b9330409513",
    historyType: "OBJECT",
    mapId: "b2f73daf-e767-4d8d-9506-52589d4fd039",
    cardId: "09f3bf62-7658-4b3e-aec0-559b55c033a6",
    objectId: "8f479cad-50a1-4604-92cd-df60b0291b9e",
    data: {
      operation: "CREATE_EDGE",
      edgeId: "041c1000-5af7-458a-97f5-e7a748021882",
      fromId: "8f479cad-50a1-4604-92cd-df60b0291b9e",
      toId: "4fb35a07-176f-484e-a93d-a9c8d4edc3f3"
    },
  });

};
