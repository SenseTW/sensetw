import * as Knex from "knex";
import {
  ID,
  User,
  mapData,
  mapFields,
  objectData,
  objectFields,
  edgeData,
  edgeFields,
  cardData,
  cardFields,
  boxData,
  boxFields
} from "./sql";
import { writeHistory } from "./history";

enum TransactionStatus {
  UNSAVED,
  SAVED,
  SUCCESS,
  FAILED
}

export type Transaction = {
  op: string;
  mapId?: ID;
  objectId?: ID;
  edgeId?: ID;
  cardId?: ID;
  boxId?: ID;
  data?: any;
  before?: any;
};

type TransactionResult = {
  status: TransactionStatus;
  transaction: Transaction;
  mapId: ID;
};

function successResult(mapId: ID, transaction: Transaction): TransactionResult {
  return { status: TransactionStatus.SUCCESS, mapId, transaction };
}

function failedResult(mapId: ID, transaction: Transaction): TransactionResult {
  return { status: TransactionStatus.FAILED, mapId, transaction };
}

export function createMap(args: any): Transaction {
  const data = mapData(args);
  return { op: "CREATE_MAP", data };
}

export function updateMap(mapId: ID, args): Transaction {
  const data = mapData(args);
  return { op: "UPDATE_MAP", mapId, data };
}

export function deleteMap(mapId: ID): Transaction {
  return { op: "DELETE_MAP", mapId };
}

export function createObject(args): Transaction {
  const data = objectData(args);
  return { op: "CREATE_OBJECT", data };
}

export function updateObject(objectId: ID, args): Transaction {
  const data = objectData(args);
  return { op: "UPDATE_OBJECT", objectId, data };
}

export function deleteObject(objectId: ID): Transaction {
  return { op: "DELETE_OBJECT", objectId };
}

export function createEdge(args): Transaction {
  const data = edgeData(args);
  return { op: "CREATE_EDGE", data };
}

export function updateEdge(edgeId: ID, args): Transaction {
  const data = edgeData(args);
  return { op: "UPDATE_EDGE", edgeId, data };
}

export function deleteEdge(edgeId: ID): Transaction {
  return { op: "DELETE_EDGE", edgeId };
}

export function createCard(args): Transaction {
  const data = cardData(args);
  return { op: "CREATE_CARD", data };
}

export function updateCard(cardId: ID, args): Transaction {
  const data = cardData(args);
  return { op: "UPDATE_CARD", cardId, data };
}

export function deleteCard(cardId: ID): Transaction {
  return { op: "DELETE_CARD", cardId };
}

export function createBox(args): Transaction {
  const data = boxData(args);
  return { op: "CREATE_BOX", data };
}

export function updateBox(boxId: ID, args): Transaction {
  const data = boxData(args);
  return { op: "UPDATE_BOX", boxId, data };
}

export function deleteBox(boxId: ID): Transaction {
  return { op: "DELETE_BOX", boxId };
}

export function addObjectToBox(objectId: ID, boxId: ID): Transaction {
  return { op: "ADD_OBJECT_TO_BOX", objectId, boxId };
}

export function removeObjectFromBox(objectId: ID, boxId: ID): Transaction {
  return { op: "REMOVE_OBJECT_FROM_BOX", objectId, boxId };
}

async function updateMapUpdatedAt(db, id: ID) {
  await db("map")
    .where("id", id)
    .update({ updatedAt: new Date() });
}

async function saveTransaction(db: Knex, user: User, trx: Transaction) {
  await db("transaction").insert({ data: trx });
}

export async function runTransaction(
  pgtrx: Knex,
  trx: Transaction
): Promise<TransactionResult> {
  switch (trx.op) {
    case "CREATE_MAP": {
      const rows = await pgtrx("map")
        .insert(trx.data)
        .returning(mapFields);
      trx.data = rows[0];
      return successResult(rows[0].id, trx);
    }
    case "UPDATE_MAP": {
      const before = await pgtrx
        .select(mapFields)
        .from("map")
        .where("id", trx.mapId)
        .first();
      const rows = await pgtrx("map")
        .where("id", trx.mapId)
        .update(trx.data)
        .returning(mapFields);
      trx.data = rows[0];
      trx.before = before;
      return successResult(trx.mapId, trx);
    }
    case "DELETE_MAP": {
      const rows = await pgtrx("map")
        .where("id", trx.mapId)
        .del()
        .returning(mapFields);
      trx.data = rows[0];
      return successResult(trx.mapId, trx);
    }
    case "CREATE_OBJECT": {
      const rows = await pgtrx("object")
        .insert(trx.data)
        .returning(objectFields);
      trx.data = rows[0];
      return successResult(rows[0].mapId, trx);
    }
    case "UPDATE_OBJECT": {
      const before = await pgtrx
        .select(objectFields)
        .from("object")
        .where("id", trx.objectId)
        .first();
      const rows = await pgtrx("object")
        .where("id", trx.objectId)
        .update(trx.data)
        .returning(objectFields);
      trx.data = rows[0];
      trx.before = before;
      return successResult(rows[0].mapId, trx);
    }
    case "DELETE_OBJECT": {
      const rows = await pgtrx("object")
        .where("id", trx.objectId)
        .del()
        .returning(objectFields);
      trx.data = rows[0];
      return successResult(rows[0].mapId, trx);
    }
    case "CREATE_EDGE": {
      const rows = await pgtrx("edge")
        .insert(trx.data)
        .returning(edgeFields);
      trx.data = rows[0];
      return successResult(rows[0].mapId, trx);
    }
    case "UPDATE_EDGE": {
      const before = await pgtrx
        .select(edgeFields)
        .from("edge")
        .where("id", trx.edgeId)
        .first();
      const rows = await pgtrx("edge")
        .where("id", trx.edgeId)
        .update(trx.data)
        .returning(edgeFields);
      trx.data = rows[0];
      trx.before = before;
      return successResult(rows[0].mapId, trx);
    }
    case "DELETE_EDGE": {
      const rows = await pgtrx("edge")
        .where("id", trx.edgeId)
        .delete()
        .returning(edgeFields);
      trx.data = rows[0];
      return successResult(rows[0].mapId, trx);
    }
    case "CREATE_CARD": {
      const rows = await pgtrx("card")
        .insert(trx.data)
        .returning(cardFields);
      trx.data = rows[0];
      return successResult(rows[0].mapId, trx);
    }
    case "UPDATE_CARD": {
      const before = await pgtrx
        .select(cardFields)
        .from("card")
        .where("id", trx.cardId)
        .first();
      const rows = await pgtrx("card")
        .where("id", trx.cardId)
        .update(trx.data)
        .returning(cardFields);
      trx.data = rows[0];
      trx.before = before;
      return successResult(rows[0].mapId, trx);
    }
    case "DELETE_CARD": {
      const rows = await pgtrx("card")
        .where("id", trx.cardId)
        .delete()
        .returning(cardFields);
      trx.data = rows[0];
      return successResult(rows[0].mapId, trx);
    }
    case "CREATE_BOX": {
      const rows = await pgtrx("box")
        .insert(trx.data)
        .returning(boxFields);
      trx.data = rows[0];
      return successResult(rows[0].mapId, trx);
    }
    case "UPDATE_BOX": {
      const before = await pgtrx
        .select(boxFields)
        .from("box")
        .where("id", trx.boxId)
        .first();
      const rows = await pgtrx("box")
        .where("id", trx.boxId)
        .update(trx.data)
        .returning(boxFields);
      trx.data = rows[0];
      trx.before = before;
      return successResult(rows[0].mapId, trx);
    }
    case "DELETE_BOX": {
      const rows = await pgtrx("box")
        .where("id", trx.boxId)
        .delete()
        .returning(boxFields);
      trx.data = rows[0];
      return successResult(rows[0].mapId, trx);
    }
    case "ADD_OBJECT_TO_BOX": {
      const rows = await pgtrx("object")
        .where("id", trx.objectId)
        .update({ belongsToId: trx.boxId })
        .returning(objectFields);
      trx.data = {
        containsObject: trx.objectId,
        belongsToBox: trx.boxId
      };
      return successResult(rows[0].mapId, trx);
    }
    case "REMOVE_OBJECT_FROM_BOX": {
      const rows = await pgtrx("object")
        .where("id", trx.objectId)
        .update({ belongsToId: pgtrx.raw("NULL") })
        .returning(objectFields);
      trx.data = {
        containsObject: trx.objectId,
        belongsToBox: trx.boxId
      };
      return successResult(rows[0].mapId, trx);
    }
    default: {
      return failedResult(trx.mapId, trx);
    }
  }
}

export async function run(
  db: Knex,
  user: User,
  trx: Transaction
): Promise<TransactionResult> {
  return db.transaction(async pgtrx => {
    const result = await runTransaction(pgtrx, trx);
    if (result.status == TransactionStatus.SUCCESS) {
      await saveTransaction(pgtrx, user, result.transaction);
      await writeHistory(pgtrx, result.transaction);
      await updateMapUpdatedAt(pgtrx, result.mapId);
    }
    return result;
  });
}
