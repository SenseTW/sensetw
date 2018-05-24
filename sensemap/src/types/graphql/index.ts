import { client } from './client';
import { ObjectID } from '../sense/object';
import { BoxID } from '../sense/box';
import { CardID } from '../sense/card';
import * as GO from './object';
import * as GC from './card';

export const addCardToBox =
  (cardObject: ObjectID, box: BoxID) => {
    const query = `
      mutation AddCardToBox($cardObject: ID!, $box: ID!) {
        addToContainCards(belongsToBoxId: $box, containsObjectId: $cardObject) {
          containsObject { id } belongsToBox { id }
        }
      }
    `;
    const variables = { cardObject, box };
    return client.request(query, variables);
  };

export const removeCardFromBox =
  (cardObject: ObjectID, box: BoxID) => {
    const query = `
      mutation RemoveCardFromBox($cardObject: ID!, $box: ID!) {
        removeFromContainCards(belongsToBoxId: $box, containsObjectId: $cardObject) {
          containsObject { id } belongsToBox { id }
        }
      }
    `;
    const variables = { cardObject, box };
    return client.request(query, variables);
  };

export const deleteObjectsByCard =
  (cardID: CardID) => {
    const query = `
      query GetCard($cardID: ID!) {
        Card(id: $cardID) { ...cardFields }
      }
      ${GC.graphQLCardFieldsFragment}
    `;
    const variables = { cardID };
    return client.request(query, variables)
      .then(({ Card }: { Card: { objects: { id: ObjectID }[] } }) =>
            Card.objects.map(({ id }) => id))
      .then((ids) => Promise.all(ids.map(GO.remove)));
  };

export const deleteObjectsByBox =
  (boxID: BoxID) => {
    const query = `
      query GetBoxObjects($boxID: ID!) {
        Box(id: $boxID) { objects { id } }
      }
    `;
    const variables = { boxID };
    return client.request(query, variables)
      .then(({ Box }: { Box: { objects: { id: ObjectID }[] } }) =>
            Box.objects.map(({ id }) => id))
      .then((ids) => Promise.all(ids.map(GO.remove)));
  };
