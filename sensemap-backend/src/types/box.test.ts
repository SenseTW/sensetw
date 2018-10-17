import * as B from "./box";
import * as O from "./object";
import { maps, boxes } from "../../seeds/dev";
import { context } from "../context";

const { db } = context();
beforeEach(() => db.seed.run());
afterAll(() => db.destroy());

test("getBox", async () => {
  const box = await B.getBox(db, boxes[0].id);
  expect(box.id).toEqual(boxes[0].id);
  expect(box.map).toEqual(boxes[0].map);
});

test("create/update/delete Box", async () => {
  const box = await B.resolvers.Mutation.createBox(
    null,
    { boxType: "INFO", mapId: maps[0].id },
    { db }
  );
  const b1 = await B.getBox(db, box.id);
  expect(b1).toEqual(box);

  const b2 = await B.resolvers.Mutation.updateBox(
    null,
    { id: box.id, title: "foobar" },
    { db }
  );
  expect(b2.title).toBe("foobar");

  const b3 = await B.getBox(db, box.id);
  expect(b3.title).toBe("foobar");

  const b4 = await B.resolvers.Mutation.deleteBox(null, { id: box.id }, { db });
  expect(b4).toEqual(b3);

  const b5 = await B.getBox(db, box.id);
  expect(b5).toBeNull();
});

test("addToContainCards", async () => {
  const box = await B.resolvers.Mutation.createBox(
    null,
    {
      boxType: "INFO",
      mapId: maps[0].id
    },
    { db }
  );
  const obj = await O.resolvers.Mutation.createObject(
    null,
    {
      mapId: maps[0].id,
      objectType: "CARD"
    },
    { db }
  );
  expect(box.contains).toEqual([]);

  const r1 = await B.resolvers.Mutation.addToContainCards(
    null,
    {
      containsObjectId: obj.id,
      belongsToBoxId: box.id
    },
    { db }
  );

  const b1 = await B.getBox(db, box.id);
  expect(b1.contains).toEqual([obj.id]);
  expect(r1.containsObject).toBe(obj.id);
  expect(r1.belongsToBox).toBe(box.id);

  const r2 = await B.resolvers.Mutation.removeFromContainCards(
    null,
    {
      containsObjectId: obj.id,
      belongsToBoxId: box.id
    },
    { db }
  );

  const b2 = await B.getBox(db, box.id);
  expect(b2.contains).toEqual([]);
  expect(r2.containsObject).toBe(obj.id);
  expect(r2.belongsToBox).toBe(box.id);
});
