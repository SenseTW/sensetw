#!/usr/bin/env ts-node
import { anonymousUser as anonymous } from '../src/types/session';
import { toIDMap } from '../src/types/sense/has-id';
import { ObjectID, ObjectType, ObjectData } from '../src/types/sense/object';
import { BoxID, BoxData } from '../src/types/sense/box';
import { CardID, CardData } from '../src/types/sense/card';
import * as O from '../src/types/graphql/object';
import * as B from '../src/types/graphql/box';
import * as C from '../src/types/graphql/card';
import * as E from '../src/types/graphql/edge';

type Ancestors
  = null        // unreachable
  | ObjectID[]; // [] if the node is the root object

type AncestorMap = {
  [key: string]: Ancestors,
};

// context
const mapId = '12495dd1-c79b-4292-b413-98e81be4beda';
const rootId = 'ffa3ccc3-4d9b-4515-b554-14f6343cc99d';

let ancestorMap: AncestorMap = {};
let connectionMap: { [key: string]: ObjectID[] } = {};

function lengthOfAncestors(ancestors: Ancestors): number {
  if (ancestors === null) { return Infinity; }
  return ancestors.length;
}

function findAncestors(ancestors: ObjectID[], id: ObjectID) {
  if (lengthOfAncestors(ancestors) < lengthOfAncestors(ancestorMap[id])) {
    ancestorMap[id] = ancestors;
    for (let connection of connectionMap[id]) {
      findAncestors([...ancestors, id], connection);
    }
  }
}

// main
async function main() {
  const objectRequest = O.loadObjects(anonymous, mapId);
  const edgeRequest = E.load(anonymous, mapId);
  const [objects, edges] = [await objectRequest, await edgeRequest];

  // set up the context
  for (let object of objects) {
    ancestorMap[object.id] = null;
    connectionMap[object.id] = [];
  }
  for (let edge of edges) {
    connectionMap[edge.from].push(edge.to);
    connectionMap[edge.to].push(edge.from);
  }

  // find relations
  findAncestors([], rootId);

  // then write ancestors back to boxes and cards
  const boxRequest = B.loadBoxes(anonymous, mapId);
  const cardRequest = C.loadCards(anonymous, mapId);
  const [boxMap, cardMap] = [
    toIDMap<BoxID, BoxData>(await boxRequest),
    toIDMap<CardID, CardData>(await cardRequest),
  ];
  const objectMap = toIDMap<ObjectID, ObjectData>(objects);
  let cards = [];
  let boxes = [];
  const toDataID = (oid: ObjectID) => objectMap[oid].data;
  const toReadable = (oid: ObjectID) => {
    const o = objectMap[oid];
    switch (o.objectType) {
      case ObjectType.BOX:
        const box = boxMap[o.data];
        return box.title || box.summary;
      case ObjectType.CARD:
        const card = cardMap[o.data];
        return card.summary || card.title;
      default:
        return '';
    }
  };

  for (let object of objects) {
    const ancestors = ancestorMap[object.id];
    switch (object.objectType) {
      case ObjectType.BOX:
        if (ancestors === null) {
          boxes.push(boxMap[object.data]);
          continue;
        }
        boxes.push({
          ...boxMap[object.data],
          ancestorIds: ancestors.map(toDataID),
          ancestors: ancestors.map(toReadable),
        });
        break;
      case ObjectType.CARD:
        if (ancestors === null) {
          cards.push(cardMap[object.data]);
          continue;
        }
        cards.push({
          ...cardMap[object.data],
          ancestorIds: ancestors.map(toDataID),
          ancestors: ancestors.map(toReadable),
        });
        break;
      default:
    }
  }

  // tslint:disable-next-line:no-console
  console.log(JSON.stringify({ boxes, cards }, null, 2));
}

main();
