import { context } from "../context";
import { transactionToHistory } from "./history";

const { db } = context();
beforeEach(() => db.seed.run());
afterAll(() => db.destroy());

describe("writeHistory", () => {
  test("CREATE_MAP", async () => {
    const trx = {
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
    };
    const hs = transactionToHistory(trx);
    expect(hs).toEqual([]);
  });
});
