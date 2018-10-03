import { resolvers } from ".";
import { maps } from "../../seeds/dev";
import { context } from "../context";

const { db } = context();
beforeEach(() => db.seed.run());
afterAll(() => db.destroy());

test("ping", () => {
  expect(resolvers.Query.ping()).toBe("pong");
});

describe("allObjects", () => {
  test("no filter", async () => {
    const xs = await resolvers.Query.allObjects(
      null,
      {},
      context({ req: null }),
      null
    );
    const x = xs[0];

    expect(x.objectType).toMatch(/(CARD|BOX)/);
    if (x.objectType === "CARD") {
      expect(typeof x.cardId).toBe("string");
      expect(x.boxId).toBeNull();
    } else if (x.objectType === "BOX") {
      expect(typeof x.boxId).toBe("string");
      expect(x.cardId).toBeNull();
    }
  });

  test("map filter", async () => {
    const xs0 = await resolvers.Query.allObjects(
      null,
      {},
      context({ req: null }),
      null
    );
    const xs1 = await resolvers.Query.allObjects(
      null,
      { filter: { map: { id: maps[0].id } } },
      context({ req: null }),
      null
    );
    expect(xs1.length < xs0.length).toBeTruthy();
  });
});
