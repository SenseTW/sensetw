import * as H from '../sense/has-id';
import { ObjectID } from '../sense/object';
import { MapID } from '../sense/map';
import { CardID, CardData, stringToType as stringToCardType } from '../sense/card';
import * as U from './user';
import { client } from './client';
import * as SN from '../session';
import * as moment from 'moment';
import { anonymousUserData } from '../sense/user';

export const graphQLCardFieldsFragment = `
  fragment cardFields on Card {
    id,
    createdAt, updatedAt,
    title, summary, quote, description, tags, saidBy, stakeholder, url, cardType,
    objects { id }, map { id }, owner { id, email, username }
  }`;

interface GraphQLCardFields {
  id:          string;
  createdAt:   string;
  updatedAt:   string;
  title:       string;
  summary:     string;
  quote:       string;
  description: string;
  tags:        string;
  saidBy:      string;
  stakeholder: string;
  url:         string;
  cardType:    string;
  objects:     H.HasID<ObjectID>[];
  map?:        H.HasID<MapID>;
  owner:       U.GraphQLUserFields;
}

const toCardData: (c: GraphQLCardFields) => CardData =
  c => ({
    id:          c.id,
    createdAt:   +moment(c.createdAt),
    updatedAt:   +moment(c.updatedAt),
    title:       c.title,
    summary:     c.summary,
    quote:       c.quote || '',
    description: c.description || '',
    tags:        c.tags || '',
    saidBy:      c.saidBy,
    stakeholder: c.stakeholder,
    url:         c.url,
    cardType:    stringToCardType(c.cardType),
    objects:     H.toIDMap(c.objects),
    owner:       U.toUserData(c.owner) || anonymousUserData,
  });

export const loadCards =
  (user: SN.User, id: MapID) => {
    const query = `
      query AllCards($id: ID!) {
        allCards(filter: { map: { id: $id } }) {
          id, createdAt, updatedAt, title, summary, quote, description, tags, saidBy, stakeholder,
          url, cardType, objects { id }, owner { id, email, username }
        }
      }
    `;
    const variables = { id };
    return client(user).request(query, variables)
      .then(({ allCards }) => allCards.map(toCardData));
  };

export const create =
  (user: SN.User, mapId: MapID, card: CardData) => {
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
    return client(user).request(query, { ...card, mapId })
      .then(({ createCard }) => toCardData(createCard));
  };

export const update =
  (user: SN.User, card: CardData) => {
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
    return client(user).request(query, card)
      .then(({ updateCard }) => toCardData(updateCard));
  };

export const remove =
  (user: SN.User, cardID: CardID) => {
    const query = `
      mutation DeleteCard($cardID: ID!) {
        deleteCard(id: $cardID) { ...cardFields }
      }
      ${graphQLCardFieldsFragment}
    `;
    const variables = { cardID };
    return client(user).request(query, variables)
      .then(({ deleteCard }) => toCardData(deleteCard));
  };
