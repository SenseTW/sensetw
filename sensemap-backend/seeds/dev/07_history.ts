import * as Knex from "knex";

exports.seed = async function(knex: Knex): Promise<any> {
  await knex("transaction").insert({
    userId: "dd776858-52f4-48b4-b40c-2b9330409513",
    data: {
      op: "CREATE_MAP",
      data: {
        id: "b2f73daf-e767-4d8d-9506-52589d4fd039",
        name: "Yolo",
        description: "Make the best of your time",
        type: "PUBLIC",
        tags: "yolo",
        image: "",
        owner: "dd776858-52f4-48b4-b40c-2b9330409513"
      }
    }
  });

  await knex("transaction").insert({
    userId: "dd776858-52f4-48b4-b40c-2b9330409513",
    data: {
      op: "UPDATE_MAP",
      mapId: "b2f73daf-e767-4d8d-9506-52589d4fd039",
      data: {
        id: "b2f73daf-e767-4d8d-9506-52589d4fd039",
        name: "Yolo",
        description: "Make the best of your time",
        type: "PUBLIC",
        tags: "yolo, foobar, baz",
        image: "",
        owner: "dd776858-52f4-48b4-b40c-2b9330409513"
      },
      before: {
        id: "b2f73daf-e767-4d8d-9506-52589d4fd039",
        name: "Yolo",
        description: "Make the best of your time",
        type: "PUBLIC",
        tags: "yolo",
        image: "",
        owner: "dd776858-52f4-48b4-b40c-2b9330409513"
      }
    }
  });

  await knex("transaction").insert({
    userId: "dd776858-52f4-48b4-b40c-2b9330409513",
    data: {
      op: "DELETE_MAP",
      mapId: "b2f73daf-e767-4d8d-9506-52589d4fd039",
      data: {
        id: "b2f73daf-e767-4d8d-9506-52589d4fd039",
        name: "Yolo",
        description: "Make the best of your time",
        type: "PUBLIC",
        tags: "yolo, foobar, baz",
        image: "",
        owner: "dd776858-52f4-48b4-b40c-2b9330409513"
      }
    }
  });

  await knex("transaction").insert({
    userId: "dd776858-52f4-48b4-b40c-2b9330409513",
    data: {
      op: "CREATE_OBJECT",
      data: {
        id: "8f479cad-50a1-4604-92cd-df60b0291b9e",
        map: "b2f73daf-e767-4d8d-9506-52589d4fd039",
        x: 593,
        y: 320,
        zIndex: 0,
        objectType: "CARD",
        card: "09f3bf62-7658-4b3e-aec0-559b55c033a6",
        box: null,
        width: 0,
        height: 0
      }
    }
  });

  await knex("transaction").insert({
    userId: "dd776858-52f4-48b4-b40c-2b9330409513",
    data: {
      op: "CREATE_EDGE",
      data: {
        id: "041c1000-5af7-458a-97f5-e7a748021882",
        map: "b2f73daf-e767-4d8d-9506-52589d4fd039",
        from: "8f479cad-50a1-4604-92cd-df60b0291b9e",
        to: "4fb35a07-176f-484e-a93d-a9c8d4edc3f3"
      }
    }
  });

  await knex("transaction").insert({
    userId: "dd776858-52f4-48b4-b40c-2b9330409513",
    data: {
      op: "CREATE_BOX",
      data: {
        id: "10330ced-04b4-46d3-91a6-1d294bb12da3",
        map: "b2f73daf-e767-4d8d-9506-52589d4fd039",
        boxType: "INFO",
        owner: "dd776858-52f4-48b4-b40c-2b9330409513"
      }
    }
  });

  await knex("transaction").insert({
    userId: "dd776858-52f4-48b4-b40c-2b9330409513",
    data: {
      op: "ADD_OBJECT_TO_BOX",
      data: {
        belongsToBox: "10330ced-04b4-46d3-91a6-1d294bb12da3",
        containsObject: "8f479cad-50a1-4604-92cd-df60b0291b9e"
      }
    }
  });

  await knex("transaction").insert({
    userId: "dd776858-52f4-48b4-b40c-2b9330409513",
    data: {
      op: "REMOVE_OBJECT_FROM_BOX",
      data: {
        belongsToBox: "10330ced-04b4-46d3-91a6-1d294bb12da3",
        containsObject: "8f479cad-50a1-4604-92cd-df60b0291b9e"
      }
    }
  });
};
