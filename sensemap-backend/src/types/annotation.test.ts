import * as A from "./annotation";
import * as C from "./card";
import { users, maps, annotations } from "../../seeds/dev";
import { context } from "../context";

const { db } = context();
beforeEach(() => db.seed.run());
afterAll(() => db.destroy());

test("getAnnotation", async () => {
  const a0 = await A.getAnnotation(db, annotations[0].id);
  expect(a0.id).toBeTruthy();
  expect(a0.mapId).toBeTruthy();
  expect(a0.target[0].source).toBeTruthy();
  expect(a0.card.id).toBeTruthy();
});

test("create/update/delete annotation", async () => {
  const a0 = await A.createAnnotation(db, users[0], {
    mapId: maps[0].id,
    target: [
      {
        source: "https://example.com/",
        selector: [
          {
            conformsTo: "https://tools.ietf.org/html/rfc3236",
            type: "FragmentSelector",
            value: "content"
          }
        ]
      }
    ]
  });
  expect(a0.id).toBeTruthy();
  expect(a0.target[0].selector[0].type).toBe("FragmentSelector");

  const a1 = await A.updateAnnotation(db, users[0], a0.id, {
    target: [
      {
        source: "https://foobar.com/",
        selector: [
          {
            endContainer: "/main[1]/div[2]/div[1]/div[1]/div[3]/p[1]",
            startContainer: "/main[1]/div[2]/div[1]/div[1]/div[3]/p[1]",
            type: "RangeSelector",
            startOffset: 0,
            endOffset: 74
          }
        ]
      }
    ]
  });
  expect(a1.target[0].selector[0].type).toBe("RangeSelector");

  const a2 = await A.deleteAnnotation(db, users[0], a0.id);
  const a3 = await A.getAnnotation(db, a0.id);
  expect(a3).toBeNull();
});

test("create/update/delete annotation /w card", async () => {
  const a0 = await A.createAnnotation(db, users[0], {
    mapId: maps[0].id,
    target: [],
    card: {
      title: "foo",
      cardType: "INFO",
      url: "http://example.com",
      mapId: maps[0].id
    }
  });
  expect(a0.id).toBeTruthy();
  expect(a0.card.id).toBeTruthy();

  const a2 = await A.updateAnnotation(db, users[0], a0.id, {
    target: [
      {
        source: "https://foobar.com/",
        selector: [
          {
            endContainer: "/main[1]/div[2]/div[1]/div[1]/div[3]/p[1]",
            startContainer: "/main[1]/div[2]/div[1]/div[1]/div[3]/p[1]",
            type: "RangeSelector",
            startOffset: 0,
            endOffset: 74
          }
        ]
      }
    ],
    card: {
      title: "Example",
      description: "Hello"
    }
  });
  expect(a2.card.title).toBe("Example");

  const a3 = await A.deleteAnnotation(db, users[0], a0.id);
  const c = await C.getCard(db, a2.card.id);
  expect(c).toBeNull();
});
