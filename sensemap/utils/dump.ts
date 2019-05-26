#!/usr/bin/env ts-node
import * as path from 'path';
import * as fs from 'fs-extra';
import * as yargs from 'yargs';
import { anonymousUser as anonymous } from '../src/types/session';
import * as M from '../src/types/graphql/map';
import * as O from '../src/types/graphql/object';
import * as B from '../src/types/graphql/box';
import * as C from '../src/types/graphql/card';
import * as E from '../src/types/graphql/edge';
import * as U from '../src/types/graphql/user';
import { pipe, identity, ascend, sort, dropRepeats, filter } from 'ramda';

const argv = yargs
  .default({ d: 'dump/' })
  .argv;

const dist = path.resolve(process.cwd(), argv.d);

const dropZeros = filter(x => x && x !== '0');
const dedup = pipe(sort(ascend(identity)), dropRepeats);

let userIdList = [];

async function main() {
  let filepath;

  await fs.mkdirp(dist);

  const mapList = await M.loadMaps(anonymous);
  filepath = path.resolve(dist, 'maps.json');
  console.log(filepath);
  await fs.writeJson(filepath, mapList);

  for (let map of mapList) {
    filepath = path.resolve(dist, map.id);
    await fs.mkdirp(filepath);

    const objectList = await O.loadObjects(anonymous, map.id);
    filepath = path.resolve(dist, map.id, 'objects.json');
    console.log(filepath);
    await fs.writeJson(filepath, objectList);

    const boxList = await B.loadBoxes(anonymous, map.id);
    filepath = path.resolve(dist, map.id, 'boxes.json');
    console.log(filepath);
    await fs.writeJson(filepath, boxList);

    for (let box of boxList) {
      if (box && box.owner && box.owner.id) {
        userIdList.push(box.owner.id);
      }
    }

    const cardList = await C.loadCards(anonymous, map.id);
    filepath = path.resolve(dist, map.id, 'cards.json');
    console.log(filepath);
    await fs.writeJson(filepath, cardList);

    for (let card of cardList) {
      if (card && card.owner && card.owner.id) {
        userIdList.push(card.owner.id);
      }
    }

    const edgeList = await E.load(anonymous, map.id);
    filepath = path.resolve(dist, map.id, 'edges.json');
    console.log(filepath);
    await fs.writeJson(filepath, edgeList);
  }

  userIdList = dropZeros(userIdList);
  userIdList = dedup(userIdList);
  const userList = await U.loadByIds(anonymous, userIdList);
  filepath = path.resolve(dist, 'users.json');
  console.log(filepath);
  await fs.writeJson(filepath, userList);
}

main();
