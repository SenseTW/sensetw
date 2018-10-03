import * as C from "./card";
import { context } from "../context";
import { maps } from "../../seeds/dev";

const { db } = context();
beforeEach(() => db.seed.run());
afterAll(() => db.destroy());

describe("create/update/deleteCard", () => {
  test("Card quote is writable at operation level", async () => {
    const mapId = maps[0].id;
    const c0 = await C.createCard(db, {
      cardType: "INFO",
      quote: "mono no aware",
      mapId
    });
    expect(c0.id).toBeTruthy();
    expect(c0.objects).toEqual([]);
    expect(c0.quote).toBe("mono no aware");
    expect(c0.map).toBe(mapId);

    const c1 = await C.updateCard(db, c0.id, {
      summary: "sweet variety peas",
      quote: "always adopt never buy"
    });
    expect(c1.summary).toBe("sweet variety peas");
    expect(c1.quote).toBe("always adopt never buy");
  });
});

describe("getAllCards", () => {
  test("no filters", async () => {
    const cs = await C.getAllCards(db);
    expect(cs.length).toBe(3);
  });

  test("filter by map", async () => {
    const cs = await C.getAllCards(db, {
      filter: { map: { id: "b2f73daf-e767-4d8d-9506-52589d4fd039" } }
    });
    expect(cs.length).toBe(2);
  });

  test("filter by url", async () => {
    const cs = await C.getAllCards(db, {
      filter: { url: "http://example.com" }
    });
    expect(cs.length).toBe(2);
  });

  test("filter by tags", async () => {
    const cs = await C.getAllCards(db, { filter: { tags: "foo" } });
    expect(cs.length).toBe(1);
  });

  test("skip/limit/orderBy", async () => {
    const cs = await C.getAllCards(db, {
      skip: 1,
      limit: 1,
      orderBy: ["updatedAt", "asc"]
    });
    expect(cs.length).toBe(1);
    expect(cs[0].id).toBe("61cfcfc1-1336-4f55-93ba-446bb8eedd4f");
  });
});

describe("GraphQL", () => {
  test("Card query", async () => {
    const id = maps[0].cards[0].id;
    const c = await C.resolvers.Query.Card(null, { id }, { db }, null);
    expect(c.objects.length).toBeGreaterThanOrEqual(0);
  });

  test("create/update/deleteCard", async () => {
    const mapId = maps[0].id;
    const c0 = await C.resolvers.Mutation.createCard(
      null,
      {
        cardType: "INFO",
        quote: "mono no aware",
        mapId
      },
      { db }
    );
    expect(c0.id).toBeTruthy();
    expect(c0.objects).toEqual([]);
    expect(c0.quote).toBe("");
    expect(c0.map).toBe(mapId);

    const c1 = await C.resolvers.Mutation.updateCard(
      null,
      {
        id: c0.id,
        summary: "sweet variety peas",
        quote: "mono no aware"
      },
      { db }
    );
    expect(c1.summary).toBe("sweet variety peas");
    expect(c1.quote).toBe("");

    const c2 = await C.resolvers.Mutation.deleteCard(
      null,
      { id: c0.id },
      { db }
    );
    expect(c2.id).toBe(c0.id);
  });

  test("card description length", async () => {
    const description = String.fromCharCode(
      ...Array(512)
        .fill(0)
        .map(() => parseInt(97 + Math.random() * 26))
    );
    const mapId = maps[0].id;
    const c0 = await C.resolvers.Mutation.createCard(
      null,
      {
        cardType: "INFO",
        mapId,
        description
      },
      { db }
    );
    expect(c0.description).toBe(description);
  });
});
