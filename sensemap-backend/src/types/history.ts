import { gql } from "apollo-server";
import * as Knex from "knex";
import { HistoryType } from "./primitive";
import { ID, History, HistoryData, historyData, historiesQuery } from "./sql";
import { Transaction } from "./transaction";

export function transactionToHistoryData(trx: Transaction): HistoryData[] {
  switch (trx.payload.op) {
    case "CREATE_MAP": {
      return [
        historyData({
          historyType: "MAP",
          transactionId: trx.id,
          userId: trx.userId,
          mapId: trx.payload.data.id,
          objectId: null,
          cardId: null,
          changes: [{ changeType: "CREATE_MAP" }]
        })
      ];
    }
    case "UPDATE_MAP": {
      return [
        historyData({
          historyType: "MAP",
          transactionId: trx.id,
          userId: trx.userId,
          mapId: trx.payload.data.id,
          objectId: null,
          cardId: null,
          changes: Object.keys(trx.payload.before)
            .filter(x => trx.payload.before[x] !== trx.payload.data[x])
            .map(field => ({
              changeType: "UPDATE_MAP",
              field,
              before: trx.payload.before[field],
              after: trx.payload.data[field]
            }))
        })
      ];
    }
    case "DELETE_MAP": {
      return [
        historyData({
          historyType: "MAP",
          transactionId: trx.id,
          userId: trx.userId,
          mapId: trx.payload.data.id,
          objectId: null,
          cardId: null,
          changes: [{ changeType: "DELETE_MAP" }]
        })
      ];
    }
    case "CREATE_OBJECT": {
      return [
        historyData({
          historyType: "OBJECT",
          transactionId: trx.id,
          userId: trx.userId,
          mapId: trx.payload.data.mapId,
          objectId: trx.payload.data.id,
          cardId: null,
          changes: [{ changeType: "CREATE_OBJECT" }]
        }),
        historyData({
          historyType: "CARD",
          transactionId: trx.id,
          userId: trx.userId,
          mapId: trx.payload.data.mapId,
          objectId: trx.payload.data.id,
          cardId: trx.payload.data.cardId,
          changes: [{ changeType: "CREATE_OBJECT" }]
        }),
        historyData({
          historyType: "MAP",
          transactionId: trx.id,
          userId: trx.userId,
          mapId: trx.payload.data.mapId,
          objectId: trx.payload.data.id,
          cardId: trx.payload.data.cardId,
          changes: [{ changeType: "CREATE_OBJECT" }]
        })
      ];
    }
    case "UPDATE_OBJECT": {
      return [];
    }
    case "DELETE_OBJECT": {
      return [
        historyData({
          historyType: "OBJECT",
          transactionId: trx.id,
          userId: trx.userId,
          mapId: trx.payload.data.mapId,
          objectId: trx.payload.data.id,
          cardId: null,
          changes: [{ changeType: "DELETE_OBJECT" }]
        }),
        historyData({
          historyType: "CARD",
          transactionId: trx.id,
          userId: trx.userId,
          mapId: trx.payload.data.mapId,
          objectId: trx.payload.data.id,
          cardId: trx.payload.data.cardId,
          changes: [{ changeType: "DELETE_OBJECT" }]
        }),
        historyData({
          historyType: "MAP",
          transactionId: trx.id,
          userId: trx.userId,
          mapId: trx.payload.data.mapId,
          objectId: trx.payload.data.id,
          cardId: trx.payload.data.cardId,
          changes: [{ changeType: "DELETE_OBJECT" }]
        })
      ];
    }
    case "CREATE_EDGE": {
      return [
        historyData({
          historyType: "OBJECT",
          transactionId: trx.id,
          userId: trx.userId,
          mapId: trx.payload.data.mapId,
          objectId: trx.payload.data.fromId,
          cardId: null,
          changes: [
            { changeType: "CREATE_EDGE", connectWith: trx.payload.data.toId }
          ]
        }),
        historyData({
          historyType: "OBJECT",
          transactionId: trx.id,
          userId: trx.userId,
          mapId: trx.payload.data.mapId,
          objectId: trx.payload.data.toId,
          cardId: null,
          changes: [
            { changeType: "CREATE_EDGE", connectWith: trx.payload.data.fromId }
          ]
        }),
        historyData({
          historyType: "MAP",
          transactionId: trx.id,
          userId: trx.userId,
          mapId: trx.payload.data.mapId,
          objectId: null,
          cardId: null,
          changes: [
            {
              changeType: "CREATE_EDGE",
              from: trx.payload.data.fromId,
              to: trx.payload.data.toId
            }
          ]
        })
      ];
    }
    case "UPDATE_EDGE": {
      return [];
    }
    case "DELETE_EDGE": {
      return [
        historyData({
          historyType: "OBJECT",
          transactionId: trx.id,
          userId: trx.userId,
          mapId: trx.payload.data.mapId,
          objectId: trx.payload.data.fromId,
          cardId: null,
          changes: [
            { changeType: "DELETE_EDGE", connectWith: trx.payload.data.toId }
          ]
        }),
        historyData({
          historyType: "OBJECT",
          transactionId: trx.id,
          userId: trx.userId,
          mapId: trx.payload.data.mapId,
          objectId: trx.payload.data.toId,
          cardId: null,
          changes: [
            { changeType: "DELETE_EDGE", connectWith: trx.payload.data.fromId }
          ]
        }),
        historyData({
          historyType: "MAP",
          transactionId: trx.id,
          userId: trx.userId,
          mapId: trx.payload.data.mapId,
          objectId: null,
          cardId: null,
          changes: [
            {
              changeType: "DELETE_EDGE",
              from: trx.payload.data.fromId,
              to: trx.payload.data.toId
            }
          ]
        })
      ];
    }
    case "CREATE_CARD": {
      return [
        historyData({
          historyType: "CARD",
          transactionId: trx.id,
          userId: trx.userId,
          mapId: trx.payload.data.mapId,
          objectId: null,
          cardId: trx.payload.data.id,
          changes: [{ changeType: "CREATE_CARD" }]
        }),
        historyData({
          historyType: "MAP",
          transactionId: trx.id,
          userId: trx.userId,
          mapId: trx.payload.data.mapId,
          objectId: null,
          cardId: trx.payload.data.id,
          changes: [{ changeType: "CREATE_CARD" }]
        })
      ];
    }
    case "UPDATE_CARD": {
      return cardSummaryUpdate(trx)
        .concat(cardTypeUpdate(trx))
        .concat(cardUpdate(trx));
    }
    case "DELETE_CARD": {
      return [
        historyData({
          historyType: "CARD",
          transactionId: trx.id,
          userId: trx.userId,
          mapId: trx.payload.data.mapId,
          objectId: null,
          cardId: trx.payload.data.id,
          changes: [{ changeType: "DELETE_CARD" }]
        }),
        historyData({
          historyType: "MAP",
          transactionId: trx.id,
          userId: trx.userId,
          mapId: trx.payload.data.mapId,
          objectId: null,
          cardId: trx.payload.data.id,
          changes: [{ changeType: "DELETE_CARD" }]
        })
      ];
    }
    case "CREATE_BOX":
    case "UPDATE_BOX":
    case "DELETE_BOX": {
      return [];
    }
    case "ADD_OBJECT_TO_BOX": {
      return [
        historyData({
          historyType: "OBJECT",
          transactionId: trx.id,
          userId: trx.userId,
          mapId: trx.payload.data.mapId,
          objectId: trx.payload.data.containsObject,
          cardId: null,
          changes: [
            {
              changeType: "ADD_OBJECT_TO_BOX",
              box: trx.payload.data.belongsToBox
            }
          ]
        }),
        historyData({
          historyType: "MAP",
          transactionId: trx.id,
          userId: trx.userId,
          mapId: trx.payload.data.mapId,
          objectId: trx.payload.data.containsObject,
          cardId: null,
          changes: [
            {
              changeType: "ADD_OBJECT_TO_BOX",
              box: trx.payload.data.belongsToBox
            }
          ]
        })
      ];
    }
    case "REMOVE_OBJECT_FROM_BOX": {
      return [
        historyData({
          historyType: "OBJECT",
          transactionId: trx.id,
          userId: trx.userId,
          mapId: trx.payload.data.mapId,
          objectId: trx.payload.data.containsObject,
          cardId: null,
          changes: [
            {
              changeType: "REMOVE_OBJECT_FROM_BOX",
              box: trx.payload.data.belongsToBox
            }
          ]
        }),
        historyData({
          historyType: "MAP",
          transactionId: trx.id,
          userId: trx.userId,
          mapId: trx.payload.data.mapId,
          objectId: trx.payload.data.containsObject,
          cardId: null,
          changes: [
            {
              changeType: "REMOVE_OBJECT_FROM_BOX",
              box: trx.payload.data.belongsToBox
            }
          ]
        })
      ];
    }
    default: {
      throw new Error(`Unknown transaction operation: ${trx.payload.op}`);
    }
  }
}

/**
 * Get of card summary updates history.
 */
function cardSummaryUpdate(trx: Transaction): HistoryData[] {
  const before = trx.payload.before;
  const after = trx.payload.data;
  if (before.summary !== after.summary) {
    return [
      historyData({
        historyType: "CARD",
        transactionId: trx.id,
        userId: trx.userId,
        mapId: trx.payload.data.mapId,
        objectId: null,
        cardId: trx.payload.data.id,
        changes: [
          {
            changeType: "UPDATE_CARD_SUMMARY",
            before: before.summary,
            after: after.summary
          }
        ]
      }),
      historyData({
        historyType: "MAP",
        transactionId: trx.id,
        userId: trx.userId,
        mapId: trx.payload.data.mapId,
        objectId: null,
        cardId: trx.payload.data.id,
        changes: [
          {
            changeType: "UPDATE_CARD_SUMMARY",
            before: before.summary,
            after: after.summary
          }
        ]
      })
    ];
  } else {
    return [];
  }
}

/**
 * Get card type updates
 */
function cardTypeUpdate(trx: Transaction): HistoryData[] {
  const before = trx.payload.before;
  const after = trx.payload.data;
  if (before.cardType !== after.cardType) {
    return [
      historyData({
        historyType: "CARD",
        transactionId: trx.id,
        userId: trx.userId,
        mapId: trx.payload.data.mapId,
        objectId: null,
        cardId: trx.payload.data.id,
        changes: [
          {
            changeType: "UPDATE_CARD_TYPE",
            before: before.cardType,
            after: after.cardType
          }
        ]
      })
    ];
  } else {
    return [];
  }
}

function cardUpdate(trx: Transaction): HistoryData[] {
  const before = trx.payload.before;
  const after = trx.payload.data;
  const changedFields = Object.keys(before).filter(
    x => x !== "summary" && x !== "cardType" && before[x] !== after[x]
  );
  return [
    historyData({
      historyType: "CARD",
      transactionId: trx.id,
      userId: trx.userId,
      mapId: trx.payload.data.mapId,
      objectId: null,
      cardId: trx.payload.data.id,
      changes: changedFields.map(field => ({
        changeType: "UPDATE_CARD",
        field,
        before: before[field],
        after: after[field]
      }))
    }),
    historyData({
      historyType: "MAP",
      transactionId: trx.id,
      userId: trx.userId,
      mapId: trx.payload.data.mapId,
      objectId: null,
      cardId: trx.payload.data.id,
      changes: changedFields.map(field => ({
        changeType: "UPDATE_CARD",
        field,
        before: before[field],
        after: after[field]
      }))
    })
  ];
}

export async function writeHistory(pgtrx: Knex, trx: Transaction) {
  return Promise.all(
    transactionToHistoryData(trx).map(hd => {
      const changes = JSON.stringify(hd.changes);
      if (changes.length > 0) {
        return pgtrx("history").insert({ ...hd, changes });
      } else {
        return null;
      }
    })
  );
}

/**
 * History typeDefs.
 */
export const typeDefs = [
  gql`
    enum HistoryType {
      MAP
      OBJECT
      CARD
    }

    input HistoryFilter {
      map: MapFilter
      card: CardFilter
      object: ObjectFilter
      historyType: HistoryType
    }

    extend type Query {
      allHistories(
        filter: HistoryFilter
        orderBy: String
        first: Int
        skip: Int
      ): [History!]!
      History(id: ID): History
    }

    type History {
      id: ID!
      createdAt: DateTime!
      updatedAt: DateTime!
      historyType: HistoryType!
      user: User
      map: Map
      object: Object
      card: Card
      changes: [Change!]!
    }

    enum ChangeType {
      CREATE_MAP
      UPDATE_MAP
      DELETE_MAP
      CREATE_OBJECT
      UPDATE_OBJECT
      DELETE_OBJECT
      CREATE_CARD
      UPDATE_CARD_SUMMARY
      UPDATE_CARD_TYPE
      UPDATE_CARD
      DELETE_CARD
      CREATE_EDGE
      UPDATE_EDGE
      DELETE_EDGE
      ADD_OBJECT_TO_BOX
      REMOVE_OBJECT_FROM_BOX
    }

    type Change {
      changeType: ChangeType!
      field: String
      before: String
      after: String
      from: Object
      to: Object
      box: Box
      connectWith: Object
    }
  `
];

export async function getHistory(db, id: ID): Promise<History> {
  const o = await historiesQuery(db)
    .where("id", id)
    .first();
  return !!o ? o : null;
}

type HistoryParent = ID | History;

type HistoryFilter = {
  id?: ID;
  map?: { id: ID };
  object?: { id: ID };
  card?: { id: ID };
  historyType?: HistoryType;
};

type AllHistoriesArgs = {
  filter?: HistoryFilter;
  orderBy?: string;
  first?: number;
  skip?: number;
};

const queryBuilder = (_query: Knex.QueryBuilder) => ({
  _query,
  query: () => _query,
  withId: id =>
    !!id ? queryBuilder(_query.andWhere("id", id)) : queryBuilder(_query),
  withMap: map =>
    !!map
      ? queryBuilder(_query.andWhere("mapId", map.id))
      : queryBuilder(_query),
  withCard: card =>
    !!card
      ? queryBuilder(_query.andWhere("cardId", card.id))
      : queryBuilder(_query),
  withObject: object =>
    !!object
      ? queryBuilder(_query.andWhere("objectId", object.id))
      : queryBuilder(_query),
  withHistoryType: historyType =>
    !!historyType
      ? queryBuilder(_query.andWhere("historyType", historyType))
      : queryBuilder(_query),
  first: n => (!!n ? queryBuilder(_query.limit(n)) : queryBuilder(_query)),
  skip: n => (!!n ? queryBuilder(_query.offset(n)) : queryBuilder(_query))
});

export const resolvers = {
  Query: {
    allHistories: async ({}, args: AllHistoriesArgs, { db }) => {
      const histories = await queryBuilder(
        historiesQuery(db).orderBy("createdAt", "desc")
      )
        .withId(args.filter.id)
        .withMap(args.filter.map)
        .withObject(args.filter.object)
        .withCard(args.filter.card)
        .withHistoryType(args.filter.historyType)
        .first(args.first)
        .skip(args.skip)
        .query();
      return histories;
    },
    History: ({}, { id }, { db }) => getHistory(db, id)
  },
  History: {
    id: async (o: HistoryParent): Promise<ID> =>
      typeof o !== "string" ? o.id : o,
    createdAt: async (o: HistoryParent, {}, { db }): Promise<Date> =>
      typeof o !== "string" ? o.createdAt : (await getHistory(db, o)).createdAt,
    updatedAt: async (o: HistoryParent, {}, { db }): Promise<Date> =>
      typeof o !== "string" ? o.updatedAt : (await getHistory(db, o)).updatedAt,
    historyType: async (o: HistoryParent, {}, { db }): Promise<string> =>
      typeof o !== "string"
        ? o.historyType
        : (await getHistory(db, o)).historyType,
    user: async (o: HistoryParent, {}, { db }): Promise<ID> =>
      typeof o !== "string" ? o.userId : (await getHistory(db, o)).userId,
    map: async (o: HistoryParent, {}, { db }): Promise<ID> =>
      typeof o !== "string" ? o.mapId : (await getHistory(db, o)).mapId,
    card: async (o: HistoryParent, {}, { db }): Promise<ID> =>
      typeof o !== "string" ? o.cardId : (await getHistory(db, o)).cardId,
    object: async (o: HistoryParent, {}, { db }): Promise<ID> =>
      typeof o !== "string" ? o.objectId : (await getHistory(db, o)).objectId,
    changes: async (o: HistoryParent, {}, { db }): Promise<any[]> =>
      typeof o !== "string" ? o.changes : (await getHistory(db, o)).changes
  }
};
