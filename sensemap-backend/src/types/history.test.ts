import { context } from "../context";
import { maps, users } from "../../seeds/dev";
import { transactionToHistoryData } from "./history";

const { db } = context();
const user = users[0];
beforeEach(() => db.seed.run());
afterAll(() => db.destroy());

describe("writeHistory", () => {
  test("CREATE_MAP", async () => {
    const mapId = "b2f73daf-e767-4d8d-9506-52589d4fd039";
    const trx = {
      userId: user.id,
      payload: {
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
    const hs = transactionToHistoryData(trx);
    expect(hs).toEqual([
      {
        userId: user.id,
        historyType: "MAP",
        mapId,
        objectId: null,
        cardId: null,
        changes: [{ changeType: "CREATE_MAP" }]
      }
    ]);
  });
});
