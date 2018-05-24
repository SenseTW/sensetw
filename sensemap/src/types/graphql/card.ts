import * as H from '../sense/has-id';
import { ObjectID } from '../sense/object';
import { MapID } from '../sense-map';
import { CardID, CardData, stringToType as stringToCardType } from '../sense/card';
import { client } from './client';
import * as moment from 'moment';

export const graphQLCardFieldsFragment = `
  fragment cardFields on Card {
    id,
    createdAt, updatedAt,
    title, summary, description, tags, saidBy, stakeholder, url, cardType,
    objects { id }, map { id }
  }`;

interface GraphQLCardFields {
  id:          string;
  createdAt:   string;
  updatedAt:   string;
  title:       string;
  summary:     string;
  description: string;
  tags:        string;
  saidBy:      string;
  stakeholder: string;
  url:         string;
  cardType:    string;
  objects:     H.HasID<ObjectID>[];
  map?:        H.HasID<MapID>;
}

const toCardData: (c: GraphQLCardFields) => CardData =
  c => ({
    id:          c.id,
    createdAt:   +moment(c.createdAt),
    updatedAt:   +moment(c.updatedAt),
    title:       c.title,
    summary:     c.summary,
    description: c.description || '',
    tags:        c.tags || '',
    saidBy:      c.saidBy,
    stakeholder: c.stakeholder,
    url:         c.url,
    cardType:    stringToCardType(c.cardType),
    objects:     H.toIDMap(c.objects),
  });

export const loadCards =
  (id: MapID) => {
    const query = `
      query AllCards($id: ID!) {
        allCards(filter: { map: { id: $id } }) {
          id, createdAt, updatedAt, title, summary, description, tags, saidBy, stakeholder,
          url, cardType, objects { id }
        }
      }
    `;
    const variables = { id };
    return client.request(query, variables)
      .then(({ allCards }) => allCards.map(toCardData));
  };

export const create =
  (mapId: MapID, card: CardData) => {
    const query = `
      mutation CreateCard(
        $title: String,
        $summary: String,
        $description: String,
        $tags: String,
        $saidBy: String,
        $stakeholder: String,
        $url: String,
        $cardType: CardType,
        $mapId: ID
      ) {
        createCard(
          title: $title,
          summary: $summary,
          description: $description,
          tags: $tags,
          saidBy: $saidBy,
          stakeholder: $stakeholder,
          url: $url,
          cardType: $cardType,
          mapId: $mapId
        ) {
          ...cardFields
        }
      }
      ${graphQLCardFieldsFragment}
    `;
    return client.request(query, { ...card, mapId })
      .then(({ createCard }) => toCardData(createCard));
  };

export const update =
  (card: CardData) => {
    const query = `
      mutation UpdateCard(
        $id: ID!,
        $title: String,
        $summary: String,
        $description: String,
        $tags: String,
        $saidBy: String,
        $stakeholder: String,
        $url: String,
        $cardType: CardType
      ) {
        updateCard(
          id: $id,
          title: $title,
          summary: $summary,
          description: $description,
          tags: $tags,
          saidBy: $saidBy,
          stakeholder: $stakeholder,
          url: $url
          cardType: $cardType
        ) {
          ...cardFields
        }
      }
      ${graphQLCardFieldsFragment}
    `;
    return client.request(query, card)
      .then(({ updateCard }) => toCardData(updateCard));
  };

export const remove =
  (cardID: CardID) => {
    const query = `
      mutation DeleteCard($cardID: ID!) {
        deleteCard(id: $cardID) { ...cardFields }
      }
      ${graphQLCardFieldsFragment}
    `;
    const variables = { cardID };
    return client.request(query, variables)
      .then(({ deleteCard }) => toCardData(deleteCard));
  };
