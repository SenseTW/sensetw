import { gql } from "apollo-server";
import * as Knex from "knex";
import { HistoryData, historyData } from "./sql";
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
      return pgtrx("history").insert({
        ...hd,
        changes: JSON.stringify(hd.changes)
      });
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

    input HistoryTypeFilter {
      historyType: HistoryType
    }

    input HistoryFilter {
      map: MapFilter
      card: CardFilter
      object: ObjectFilter
      historyTypeFilter: HistoryTypeFilter
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

    # Different types of changes following historyType
    union Change = MapChange | CardChange | ObjectChange

    enum MapChangeType {
      CREATE_MAP
      UPDATE_MAP
      CREATE_CARD
      DELETE_CARD
      UPDATE_CARD_SUMMARY
      UPDATE_CARD
      CREATE_EDGE
      DELETE_EDGE
      ADD_OBJECT_TO_BOX
      REMOVE_OBJECT_FROM_BOX
    }

    type MapChange {
      changeType: MapChangeType!
      field: String
      before: String
      after: String
      from: Object
      to: Object
      box: Box
    }

    enum CardChangeType {
      CREATE_CARD
      DELETE_CARD
      CREATE_OBJECT
      UPDATE_CARD_SUMMARY
      UPDATE_CARD
      UPDATE_CARD_TYPE
    }

    type CardChange {
      changeType: CardChangeType!
      field: String
      before: String
      after: String
    }

    enum ObjectChangeType {
      CREATE_OBJECT
      DELETE_OBJECT
      UPDATE_CARD_SUMMARY
      UPDATE_CARD
      UPDATE_CARD_TYPE
      CREATE_EDGE
      DELETE_EDGE
      ADD_OBJECT_TO_BOX
      REMOVE_OBJECT_FROM_BOX
    }

    type ObjectChange {
      changeType: ObjectChangeType!
      field: String
      before: String
      after: String
      connectWith: Object
      box: Box
    }
  `
];

export const resolvers = {
  Query: {
    allHistories: () => [1, 2, 3],
    History: () => ({})
  },
  History: {
    id: () => "123",
    createdAt: () => new Date(),
    updatedAt: () => new Date(),
    historyType: () => "MAP",
    user: () => null,
    map: () => null,
    card: () => null,
    object: () => null,
    changes: () => []
  },
  Change: {}
};
