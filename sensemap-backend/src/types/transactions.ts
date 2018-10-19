import * as Knex from "knex";
import {
  ID,
  mapFields,
  mapDataFields,
  objectFields,
  objectDataFields,
  edgeFields,
  edgeDataFields,
  cardFields,
  cardDataFields,
  boxFields,
  boxDataFields
} from "./sql";
import * as R from "ramda";

enum TransactionStatus {
  UNSAVED,
  SAVED,
  SUCCESS,
  FAILED
}

type Transaction = {
  op: string;
  mapId?: ID;
  objectId?: ID;
  edgeId?: ID;
  cardId?: ID;
  boxId?: ID;
  data?: any;
};

type TransactionResult = {
  status: TransactionStatus;
  transaction: Transaction;
  mapId: ID;
  data: any;
};

function successResult(
  mapId: ID,
  transaction: Transaction,
  data: any
): TransactionResult {
  return { status: TransactionStatus.SUCCESS, mapId, transaction, data };
}

function failedResult(
  mapId: ID,
  transaction: Transaction,
  data: any
): TransactionResult {
  return { status: TransactionStatus.FAILED, mapId, transaction, data };
}

export function createMap(args): Transaction {
  const data = R.pick(mapDataFields, args);
  return { op: "CREATE_MAP", data };
}

export function updateMap(mapId: ID, args): Transaction {
  const data = R.pick(mapDataFields, args);
  return { op: "UPDATE_MAP", mapId, data };
}

export function deleteMap(mapId: ID): Transaction {
  return { op: "DELETE_MAP", mapId };
}

export function createObject(args): Transaction {
  const data = R.pick(objectDataFields, args);
  return { op: "CREATE_OBJECT", data };
}

export function updateObject(objectId: ID, args): Transaction {
  const data = R.pick(objectDataFields, args);
  return { op: "UPDATE_OBJECT", objectId, data };
}

export function deleteObject(objectId: ID): Transaction {
  return { op: "DELETE_OBJECT", objectId };
}

export function createEdge(args): Transaction {
  const data = R.pick(edgeDataFields, args);
  return { op: "CREATE_EDGE", data };
}

export function updateEdge(edgeId: ID, args): Transaction {
  const data = R.pick(edgeDataFields, args);
  return { op: "UPDATE_EDGE", edgeId, data };
}

export function deleteEdge(edgeId: ID): Transaction {
  return { op: "DELETE_EDGE", edgeId };
}

export function createCard(args): Transaction {
  const data = R.pick(cardDataFields, args);
  return { op: "CREATE_CARD", data };
}

export function updateCard(cardId: ID, args): Transaction {
  const data = R.pick(cardDataFields, args);
  return { op: "UPDATE_CARD", cardId, data };
}

export function deleteCard(cardId: ID): Transaction {
  return { op: "DELETE_CARD", cardId };
}

export function createBox(args): Transaction {
  const data = R.pick(boxDataFields, args);
  return { op: "CREATE_BOX", data };
}

export function updateBox(boxId: ID, args): Transaction {
  const data = R.pick(boxDataFields, args);
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

async function saveTransaction(db: Knex, trx: Transaction) {
  await db("transaction")
    .insert({ data: trx });
}

export async function run(
  db: Knex,
  trx: Transaction
): Promise<TransactionResult> {
  const result = await runTransaction(db, trx);
  if (result.status == TransactionStatus.SUCCESS) {
    await saveTransaction(db, result.transaction);
    await updateMapUpdatedAt(db, result.mapId);
  }
  return result;
}

export async function runTransaction(
  db: Knex,
  trx: Transaction
): Promise<TransactionResult> {
  switch (trx.op) {
    case "CREATE_MAP": {
      const rows = await db("map")
        .insert(trx.data)
        .returning(mapFields);
      return successResult(rows[0].id, trx, rows[0]);
    }
    case "UPDATE_MAP": {
      const rows = await db("map")
        .where("id", trx.mapId)
        .update(trx.data)
        .returning(mapFields);
      return successResult(trx.mapId, trx, rows[0]);
    }
    case "DELETE_MAP": {
      const rows = await db("map")
        .where("id", trx.mapId)
        .del()
        .returning(mapFields);
      return successResult(trx.mapId, trx, rows[0]);
    }
    case "CREATE_OBJECT": {
      const rows = await db("object")
        .insert(trx.data)
        .returning(objectFields);
      return successResult(rows[0].mapId, trx, rows[0]);
    }
    case "UPDATE_OBJECT": {
      const rows = await db("object")
        .where("id", trx.objectId)
        .update(trx.data)
        .returning(objectFields);
      return successResult(rows[0].mapId, trx, rows[0]);
    }
    case "DELETE_OBJECT": {
      const rows = await db("object")
        .where("id", trx.objectId)
        .del()
        .returning(objectFields);
      return successResult(rows[0].mapId, trx, rows[0]);
    }
    case "CREATE_EDGE": {
      const rows = await db("edge")
        .insert(trx.data)
        .returning(edgeFields);
      return successResult(rows[0].mapId, trx, rows[0]);
    }
    case "UPDATE_EDGE": {
      const rows = await db("edge")
        .where("id", trx.edgeId)
        .update(trx.data)
        .returning(edgeFields);
      return successResult(rows[0].mapId, trx, rows[0]);
    }
    case "DELETE_EDGE": {
      const rows = await db("edge")
        .where("id", trx.edgeId)
        .delete()
        .returning(edgeFields);
      return successResult(rows[0].mapId, trx, rows[0]);
    }
    case "CREATE_CARD": {
      const rows = await db("card")
        .insert(trx.data)
        .returning(cardFields);
      return successResult(rows[0].mapId, trx, rows[0]);
    }
    case "UPDATE_CARD": {
      const rows = await db("card")
        .where("id", trx.cardId)
        .update(trx.data)
        .returning(cardFields);
      return successResult(rows[0].mapId, trx, rows[0]);
    }
    case "DELETE_CARD": {
      const rows = await db("card")
        .where("id", trx.cardId)
        .delete()
        .returning(cardFields);
      return successResult(rows[0].mapId, trx, rows[0]);
    }
    case "CREATE_BOX": {
      const rows = await db("box")
        .insert(trx.data)
        .returning(boxFields);
      return successResult(rows[0].mapId, trx, rows[0]);
    }
    case "UPDATE_BOX": {
      const rows = await db("box")
        .where("id", trx.boxId)
        .update(trx.data)
        .returning(boxFields);
      return successResult(rows[0].mapId, trx, rows[0]);
    }
    case "DELETE_BOX": {
      const rows = await db("box")
        .where("id", trx.boxId)
        .delete()
        .returning(boxFields);
      return successResult(rows[0].mapId, trx, rows[0]);
    }
    case "ADD_OBJECT_TO_BOX": {
      const rows = await db("object")
        .where("id", trx.objectId)
        .update({ belongsToId: trx.boxId })
        .returning(objectFields);
      return successResult(rows[0].mapId, trx, {
        containsObject: trx.objectId,
        belongsToBox: trx.boxId
      });
    }
    case "REMOVE_OBJECT_FROM_BOX": {
      const rows = await db("object")
        .where("id", trx.objectId)
        .update({ belongsToId: db.raw("NULL") })
        .returning(objectFields);
      return successResult(rows[0].mapId, trx, {
        containsObject: trx.objectId,
        belongsToBox: trx.boxId
      });
    }
    default: {
      return failedResult(trx.mapId, trx, null);
    }
  }
}
