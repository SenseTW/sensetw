import { client } from './client';
import { ObjectID } from '../sense/object';
import { BoxID } from '../sense/box';
import { CardID } from '../sense/card';
import * as GO from './object';
import * as GC from './card';
import * as SN from '../session';

export const addCardToBox =
  (user: SN.User, cardObject: ObjectID, box: BoxID) => {
    const query = `
      mutation AddCardToBox($cardObject: ID!, $box: ID!) {
        addToContainCards(belongsToBoxId: $box, containsObjectId: $cardObject) {
          containsObject { id } belongsToBox { id }
        }
      }
    `;
    const variables = { cardObject, box };
    return client(user).request(query, variables);
  };

export const removeCardFromBox =
  (user: SN.User, cardObject: ObjectID, box: BoxID) => {
    const query = `
      mutation RemoveCardFromBox($cardObject: ID!, $box: ID!) {
        removeFromContainCards(belongsToBoxId: $box, containsObjectId: $cardObject) {
          containsObject { id } belongsToBox { id }
        }
      }
    `;
    const variables = { cardObject, box };
    return client(user).request(query, variables);
  };

export const deleteObjectsByCard =
  (user: SN.User, cardID: CardID) => {
    const query = `
      query GetCard($cardID: ID!) {
        Card(id: $cardID) { ...cardFields }
      }
      ${GC.graphQLCardFieldsFragment}
    `;
    const variables = { cardID };
    return client(user).request(query, variables)
      .then(({ Card }: { Card: { objects: { id: ObjectID }[] } }) =>
            Card.objects.map(({ id }) => id))
      .then((ids) => Promise.all(ids.map(id => GO.remove(user, id))));
  };

export const deleteObjectsByBox =
  (user: SN.User, boxID: BoxID) => {
    const query = `
      query GetBoxObjects($boxID: ID!) {
        Box(id: $boxID) { objects { id } }
      }
    `;
    const variables = { boxID };
    return client(user).request(query, variables)
      .then(({ Box }: { Box: { objects: { id: ObjectID }[] } }) =>
            Box.objects.map(({ id }) => id))
      .then((ids) => Promise.all(ids.map(id => GO.remove(user, id))));
  };
