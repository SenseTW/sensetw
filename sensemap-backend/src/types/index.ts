import { gql } from 'apollo-server';


export const typeDefs = gql`
  scalar DateTime

  type Query {
    ping: String
    allBoxes(filter: BoxFilter): [Box!]!
    allCards(filter: CardFilter): [Card!]!
    allEdges(filter: EdgeFilter): [Edge!]!
    allMaps(filter: MapFilter): [Map!]!
    allObjects(filter: ObjectFilter): [Object!]!
    Box(id: ID): Box
    Card(id: ID): Card
    Edge(id: ID): Edge
    Map(id: ID): Map
    Object(id: ID): Object
  }

  type Mutation {
    createBox(
      summary: String,
      tags: String,
      title: String,
      mapId: ID,
      containsIds: [ID!],
      objectsIds: [ID!]
    ): Box
    createCard(
      cardType: CardType,
      description: String,
      saidBy: String,
      stakeholder: String,
      summary: String,
      tags: String,
      title: String,
      url: String,
      mapId: ID,
      objectsIds: [ID!]
    ): Card
    createEdge(
      fromId: ID,
      mapId: ID,
      toId: ID,
    ): Edge
    createMap(
      boxesIds: [ID!],
      cardsIds: [ID!],
      edgesIds: [ID!],
      objectsIds: [ID!]
    ): Map
    createObject(
      objectType: ObjectType!,
      x: Float!,
      y: Float!,
      zIndex: Float!,
      belongsToId: ID,
      boxId: ID,
      cardId: ID,
      mapId: ID
      incomingIds: [ID!],
      outgoingIds: [ID!]
    ): Object
    updateBox(
      id: ID!,
      summary: String,
      tags: String,
      title: String,
      mapId: ID,
      containsIds: [ID!],
      objectsIds: [ID!]
    ): Box
    updateCard(
      id: ID!,
      cardType: CardType,
      description: String,
      saidBy: String,
      stakeholder: String,
      summary: String,
      tags: String,
      title: String,
      url: String,
      mapId: ID,
      objectsIds: [ID!]
    ): Card
    updateEdge(
      id: ID!,
      fromId: ID,
      mapId: ID,
      toId: ID,
    ): Edge
    updateMap(
      id: ID!,
      boxesIds: [ID!],
      cardsIds: [ID!],
      edgesIds: [ID!],
      objectsIds: [ID!]
    ): Map
    updateObject(
      id: ID!,
      objectType: ObjectType!,
      x: Float!,
      y: Float!,
      zIndex: Float!,
      belongsToId: ID,
      boxId: ID,
      cardId: ID,
      mapId: ID
      incomingIds: [ID!],
      outgoingIds: [ID!]
    ): Object
    deleteBox(
      id: ID!
    ): Box
    deleteCard(
      id: ID!
    ): Card
    deleteEdge(
      id: ID!
    ): Edge
    deleteMap(
      id: ID!
    ): Map
    deleteObject(
      id: ID!
    ): Object
    addToContainCards(
      belongsToBoxId: ID!,
      containsObjectId: ID!
    ): AddToContainCardsPayload
    removeFromContainCards(
      belongsToBoxId: ID!,
      containsObjectId: ID!
    ): RemoveFromContainCardsPayload
  }

  type Map @model {
    id: ID! @isUnique
    createdAt: DateTime!
    updatedAt: DateTime!
    objects: [Object!]! @relation(name: "MapObjects")
    edges: [Edge!]! @relation(name: "MapEdges")
    cards: [Card!]! @relation(name: "MapCards")
    boxes: [Box!]! @relation(name: "MapBoxes")
  }

  enum ObjectType {
    CARD
    BOX
  }

  enum CardType {
    NORMAL
    QUESTION
    ANSWER
    NOTE
  }

  type Object @model {
    id: ID! @isUnique
    createdAt: DateTime!
    updatedAt: DateTime!
    x: Float!
    y: Float!
    width: Float!
    height: Float!
    zIndex: Float!
    map: Map @relation(name: "MapObjects")
    objectType: ObjectType! @migrationValue(value: CARD)
    card: Card @relation(name: "ObjectCard")
    box: Box @relation(name: "ObjectBox")
    belongsTo: Box @relation(name: "ContainCards")
    outgoing: [Edge!]! @relation(name: "EdgeFrom")
    incoming: [Edge!]! @relation(name: "EdgeTo")
  }

  type Edge @model {
    id: ID! @isUnique
    createdAt: DateTime!
    updatedAt: DateTime!
    map: Map! @relation(name: "MapEdges")
    from: Object! @relation(name: "EdgeFrom")
    to: Object! @relation(name: "EdgeTo")
  }

  type Card @model {
    id: ID! @isUnique
    createdAt: DateTime!
    updatedAt: DateTime!
    title: String
    summary: String
    description: String
    tags: String
    saidBy: String
    stakeholder: String
    url: String
    cardType: CardType @migrationValue(value: NORMAL)
    objects: [Object!]! @relation(name: "ObjectCard")
    map: Map @relation(name: "MapCards")
  }

  type Box @model {
    id: ID! @isUnique
    createdAt: DateTime!
    updatedAt: DateTime!
    title: String
    summary: String
    tags: String
    objects: [Object!]! @relation(name: "ObjectBox")
    contains: [Object!]! @relation(name: "ContainCards")
    map: Map @relation(name: "MapBoxes")
  }

  type AddToContainCardsPayload {
    containsObject: Object!
    belongsToBox: Box!
  }

  type RemoveFromContainCardsPayload {
    containsObject: Object!
    belongsToBox: Box!
  }

  input BoxFilter {
    map: MapFilter
  }

  input CardFilter {
    map: MapFilter
  }

  input ObjectFilter {
    map: MapFilter
  }

  input EdgeFilter {
    map: MapFilter
  }

  input MapFilter {
    id: ID!
  }
`;

export const resolvers = {
  Query: {
    ping: (parent, args, context, info) => 'pong',
  }
}
