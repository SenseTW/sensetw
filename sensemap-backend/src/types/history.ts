import { gql } from "apollo-server";
import * as Knex from "knex";
import { ID, HistoryType } from "./sql";
import { Transaction } from "./transaction";

type History = {
  userId: ID;
  historyType: HistoryType;
  mapId: ID;
  cardId: ID;
  objectId: ID;
  changes: any[];
};

export function transactionToHistory(trx: Transaction): History[] {
  switch (trx.op) {
    case "CREATE_MAP": {
      return [];
    }
    default: {
      return [];
    }
  }
}

export async function writeHistory(pgtrx: Knex, trx: Transaction) {
  return Promise.all(
    transactionToHistory(trx).map(h => {
      return pgtrx("history").insert(h);
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
      ADD_CARD
      DELETE_CARD
      UPDATE_CARD_SUMMARY
      UPDATE_CARD
      ADD_EDGE
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
      ADD_EDGE
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
