import * as Knex from "knex";
import {
  HasID,
  HasTimestamps,
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

export type TransactionPayload = {
  op: string;
  mapId?: ID;
  objectId?: ID;
  edgeId?: ID;
  cardId?: ID;
  boxId?: ID;
  data?: any;
  before?: any;
};

type TransactionData = {
  userId: ID;
  payload: TransactionPayload;
};

export type Transaction = HasID & HasTimestamps & TransactionData;

const transactionFields: (keyof Transaction)[] = [
  "id",
  "createdAt",
  "updatedAt",
  "userId",
  "payload"
];

type TransactionResult = {
  status: TransactionStatus;
  payload: TransactionPayload;
  mapId: ID;
};

function successResult(
  mapId: ID,
  payload: TransactionPayload
): TransactionResult {
  return { status: TransactionStatus.SUCCESS, mapId, payload };
}

function failedResult(
  mapId: ID,
  payload: TransactionPayload
): TransactionResult {
  return { status: TransactionStatus.FAILED, mapId, payload };
}

export function createMap(args: any): TransactionPayload {
  const data = mapData(args);
  return { op: "CREATE_MAP", data };
}

export function updateMap(mapId: ID, args): TransactionPayload {
  const data = mapData(args);
  return { op: "UPDATE_MAP", mapId, data };
}

export function deleteMap(mapId: ID): TransactionPayload {
  return { op: "DELETE_MAP", mapId };
}

export function createObject(args): TransactionPayload {
  const data = objectData(args);
  return { op: "CREATE_OBJECT", data };
}

export function updateObject(objectId: ID, args): TransactionPayload {
  const data = objectData(args);
  return { op: "UPDATE_OBJECT", objectId, data };
}

export function deleteObject(objectId: ID): TransactionPayload {
  return { op: "DELETE_OBJECT", objectId };
}

export function createEdge(args): TransactionPayload {
  const data = edgeData(args);
  return { op: "CREATE_EDGE", data };
}

export function updateEdge(edgeId: ID, args): TransactionPayload {
  const data = edgeData(args);
  return { op: "UPDATE_EDGE", edgeId, data };
}

export function deleteEdge(edgeId: ID): TransactionPayload {
  return { op: "DELETE_EDGE", edgeId };
}

export function createCard(args): TransactionPayload {
  const data = cardData(args);
  return { op: "CREATE_CARD", data };
}

export function updateCard(cardId: ID, args): TransactionPayload {
  const data = cardData(args);
  return { op: "UPDATE_CARD", cardId, data };
}

export function deleteCard(cardId: ID): TransactionPayload {
  return { op: "DELETE_CARD", cardId };
}

export function createBox(args): TransactionPayload {
  const data = boxData(args);
  return { op: "CREATE_BOX", data };
}

export function updateBox(boxId: ID, args): TransactionPayload {
  const data = boxData(args);
  return { op: "UPDATE_BOX", boxId, data };
}

export function deleteBox(boxId: ID): TransactionPayload {
  return { op: "DELETE_BOX", boxId };
}

export function addObjectToBox(objectId: ID, boxId: ID): TransactionPayload {
  return { op: "ADD_OBJECT_TO_BOX", objectId, boxId };
}

export function removeObjectFromBox(
  objectId: ID,
  boxId: ID
): TransactionPayload {
  return { op: "REMOVE_OBJECT_FROM_BOX", objectId, boxId };
}

async function updateMapUpdatedAt(db, id: ID) {
  await db("map")
    .where("id", id)
    .update({ updatedAt: new Date() });
}

async function saveTransaction(
  db: Knex,
  user: User,
  payload: TransactionPayload
): Promise<Transaction> {
  const rows = await db("transaction")
    .insert({ userId: user.id, payload })
    .returning(transactionFields);
  return rows[0];
}

export async function runTransaction(
  db: Knex,
  payload: TransactionPayload
): Promise<TransactionResult> {
  switch (payload.op) {
    case "CREATE_MAP": {
      const rows = await db("map")
        .insert(payload.data)
        .returning(mapFields);
      payload.data = rows[0];
      return successResult(rows[0].id, payload);
    }
    case "UPDATE_MAP": {
      const before = await db
        .select(mapFields)
        .from("map")
        .where("id", payload.mapId)
        .first();
      const rows = await db("map")
        .where("id", payload.mapId)
        .update(payload.data)
        .returning(mapFields);
      payload.data = rows[0];
      payload.before = before;
      return successResult(payload.mapId, payload);
    }
    case "DELETE_MAP": {
      const rows = await db("map")
        .where("id", payload.mapId)
        .update("deletedAt", new Date())
        .returning(mapFields);
      payload.data = rows[0];
      return successResult(payload.mapId, payload);
    }
    case "CREATE_OBJECT": {
      const rows = await db("object")
        .insert(payload.data)
        .returning(objectFields);
      payload.data = rows[0];
      return successResult(rows[0].mapId, payload);
    }
    case "UPDATE_OBJECT": {
      const before = await db
        .select(objectFields)
        .from("object")
        .where("id", payload.objectId)
        .first();
      const rows = await db("object")
        .where("id", payload.objectId)
        .update(payload.data)
        .returning(objectFields);
      payload.data = rows[0];
      payload.before = before;
      return successResult(rows[0].mapId, payload);
    }
    case "DELETE_OBJECT": {
      const rows = await db("object")
        .where("id", payload.objectId)
        .update("deletedAt", new Date())
        .returning(objectFields);
      payload.data = rows[0];
      return successResult(rows[0].mapId, payload);
    }
    case "CREATE_EDGE": {
      const rows = await db("edge")
        .insert(payload.data)
        .returning(edgeFields);
      payload.data = rows[0];
      return successResult(rows[0].mapId, payload);
    }
    case "UPDATE_EDGE": {
      const before = await db
        .select(edgeFields)
        .from("edge")
        .where("id", payload.edgeId)
        .first();
      const rows = await db("edge")
        .where("id", payload.edgeId)
        .update(payload.data)
        .returning(edgeFields);
      payload.data = rows[0];
      payload.before = before;
      return successResult(rows[0].mapId, payload);
    }
    case "DELETE_EDGE": {
      const rows = await db("edge")
        .where("id", payload.edgeId)
        .update("deletedAt", new Date())
        .returning(edgeFields);
      payload.data = rows[0];
      return successResult(rows[0].mapId, payload);
    }
    case "CREATE_CARD": {
      const rows = await db("card")
        .insert(payload.data)
        .returning(cardFields);
      payload.data = rows[0];
      return successResult(rows[0].mapId, payload);
    }
    case "UPDATE_CARD": {
      const before = await db
        .select(cardFields)
        .from("card")
        .where("id", payload.cardId)
        .first();
      const rows = await db("card")
        .where("id", payload.cardId)
        .update(payload.data)
        .returning(cardFields);
      payload.data = rows[0];
      payload.before = before;
      return successResult(rows[0].mapId, payload);
    }
    case "DELETE_CARD": {
      const rows = await db("card")
        .where("id", payload.cardId)
        .update("deletedAt", new Date())
        .returning(cardFields);
      payload.data = rows[0];
      return successResult(rows[0].mapId, payload);
    }
    case "CREATE_BOX": {
      const rows = await db("box")
        .insert(payload.data)
        .returning(boxFields);
      payload.data = rows[0];
      return successResult(rows[0].mapId, payload);
    }
    case "UPDATE_BOX": {
      const before = await db
        .select(boxFields)
        .from("box")
        .where("id", payload.boxId)
        .first();
      const rows = await db("box")
        .where("id", payload.boxId)
        .update(payload.data)
        .returning(boxFields);
      payload.data = rows[0];
      payload.before = before;
      return successResult(rows[0].mapId, payload);
    }
    case "DELETE_BOX": {
      const rows = await db("box")
        .where("id", payload.boxId)
        .update("deletedAt", new Date())
        .returning(boxFields);
      payload.data = rows[0];
      return successResult(rows[0].mapId, payload);
    }
    case "ADD_OBJECT_TO_BOX": {
      const rows = await db("object")
        .where("id", payload.objectId)
        .update({ belongsToId: payload.boxId })
        .returning(objectFields);
      payload.data = {
        mapId: rows[0].mapId,
        containsObject: payload.objectId,
        belongsToBox: payload.boxId
      };
      return successResult(rows[0].mapId, payload);
    }
    case "REMOVE_OBJECT_FROM_BOX": {
      const rows = await db("object")
        .where("id", payload.objectId)
        .update({ belongsToId: db.raw("NULL") })
        .returning(objectFields);
      payload.data = {
        mapId: rows[0].mapId,
        containsObject: payload.objectId,
        belongsToBox: payload.boxId
      };
      return successResult(rows[0].mapId, payload);
    }
    default: {
      return failedResult(payload.mapId, payload);
    }
  }
}

export async function run(
  db: Knex,
  user: User,
  payload: TransactionPayload
): Promise<TransactionResult> {
  return db.transaction(async pgtrx => {
    const result = await runTransaction(pgtrx, payload);
    if (result.status == TransactionStatus.SUCCESS) {
      const trx = await saveTransaction(pgtrx, user, result.payload);
      await writeHistory(pgtrx, trx);
      await updateMapUpdatedAt(pgtrx, result.mapId);
    }
    return result;
  });
}
