import * as O from "./object";
import { context } from "../context";
import { users, maps } from "../../seeds/dev";

const { db } = context();
const user = users[0];
beforeEach(() => db.seed.run());
afterAll(() => db.destroy());

describe("GraphQL", () => {
  test("Object result fields", async () => {
    const id = maps[0].objects[0].id;
    const o = await O.resolvers.Query.Object(null, { id }, { db }, null);
    expect(o.id).toBe(id);
    expect(o.createdAt).toBeTruthy();
    expect(o.updatedAt).toBeTruthy();
    expect(typeof o.x).toBe("number");
    expect(typeof o.y).toBe("number");
    expect(typeof o.zIndex).toBe("number");
    expect(o.mapId).toBe(maps[0].id);
    expect(o.objectType).toMatch(/(CARD|BOX)/);
    if (o.objectType === "CARD") {
      expect(typeof o.cardId).toBe("string");
      expect(o.boxId).toBeNull();
    } else if (o.objectType === "BOX") {
      expect(typeof o.boxId).toBe("string");
      expect(o.cardId).toBeNull();
    }
  });

  test("createObject result fields", async () => {
    const mapId = maps[0].id;
    const cardId = maps[0].cards[0].id;
    const o = await O.resolvers.Mutation.createObject(
      null,
      {
        x: 0,
        y: 0,
        zIndex: 0,
        objectType: "CARD",
        cardId,
        mapId
      },
      { db, user },
      null
    );
    expect(o.map).toBe(mapId);
    expect(o.card).toBe(cardId);
  });

  test("create/update/delete Object", async () => {
    const mapId = maps[0].id;
    const cardId = maps[0].cards[0].id;
    const o = await O.resolvers.Mutation.createObject(
      null,
      {
        x: 0,
        y: 0,
        zIndex: 0,
        objectType: "CARD",
        cardId,
        mapId
      },
      { db, user },
    );
    expect(o.zIndex).toBe(0);

    const o1 = await O.resolvers.Mutation.updateObject(
      null,
      {
        id: o.id,
        zIndex: 10
      },
      { db, user },
    );
    expect(o1.zIndex).toBe(10);

    const o2 = await O.resolvers.Mutation.deleteObject(
      null,
      { id: o.id },
      { db, user },
    );
    expect(o2.id).toBe(o.id);

    const o3 = await O.resolvers.Query.Object(null, { id: o.id }, { db }, null);
    expect(o3).toBeNull();
  });
});
