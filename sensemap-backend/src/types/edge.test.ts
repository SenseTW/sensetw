import * as E from "./edge";
import * as O from "./object";
import { context } from "../context";
import { maps, objects } from "../../seeds/dev";

const { db } = context();
beforeEach(() => db.seed.run());
afterAll(() => db.destroy());

describe("GraphQL Mutation", () => {
  test("create/update/delete Edge", async () => {
    const e0 = await E.resolvers.Mutation.createEdge(
      null,
      {
        fromId: objects[0].id,
        toId: objects[1].id,
        mapId: maps[0].id
      },
      { db }
    );
    expect(e0.from).toBe(objects[0].id);

    await O.resolvers.Mutation.deleteObject(
      null,
      {
        id: objects[0].id
      },
      { db }
    );

    const e3 = await E.resolvers.Query.Edge(
      null,
      {
        id: e0.id
      },
      { db }
    );
    expect(e3).toBeNull();
  });
});
