import * as E from "./edge";
import * as O from "./object";
import { context } from "../context";
import { users, maps, objects } from "../../seeds/dev";

const { db } = context();
const user = users[0];
beforeEach(() => db.seed.run());
afterAll(() => db.destroy());

describe("GraphQL Mutation", () => {
  test("create/update/delete Edge", async () => {
    const e0 = await E.resolvers.Mutation.createEdge(
      null,
      {
        fromId: objects[0].id,
        toId: objects[1].id,
        mapId: maps[0].id,
        edgeType: "NONE",
        title: "Paz",
        tags: "school girl, spy",
        summary: "I will do anything to protect my namesake."
      },
      { db, user }
    );
    expect(e0.from).toBe(objects[0].id);
    expect(e0.to).toBe(objects[1].id);
    expect(e0.edgeType).toBe("NONE");
    expect(e0.title).toBe("Paz");
    expect(e0.tags).toBe("school girl, spy");
    expect(e0.summary).toBe("I will do anything to protect my namesake.");

    await O.resolvers.Mutation.deleteObject(
      null,
      {
        id: objects[0].id
      },
      { db, user }
    );

    const e3 = await E.resolvers.Query.Edge(
      null,
      {
        id: e0.id
      },
      { db, user }
    );
    expect(e3).toBeNull();
  });
});
