import { context } from "../context";
import { maps, users } from "../../seeds/dev";
import { transactionToHistory } from "./history";

const { db } = context();
const user = users[0];
beforeEach(() => db.seed.run());
afterAll(() => db.destroy());

describe("writeHistory", () => {
  test.skip("CREATE_MAP", async () => {
    const mapId = "b2f73daf-e767-4d8d-9506-52589d4fd039";
    const trx = {
      userId: user.id,
      data: {
        op: "CREATE_MAP",
        data: {
          id: mapId,
          name: "Yolo",
          description: "Make the best of your time",
          type: "PUBLIC",
          tags: "yolo",
          image: "",
          owner: user.id
        }
      }
    };
    const hs = transactionToHistory(trx);
    expect(hs).toEqual([
      {
        userId: user.id,
        historyType: "MAP",
        mapId: mapId,
        objectId: null,
        cardId: null,
        changes: [{ changeType: "CREATE_MAP" }]
      }
    ]);
  });
});
