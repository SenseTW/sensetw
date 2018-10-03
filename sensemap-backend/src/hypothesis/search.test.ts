import * as express from "express";
import * as request from "supertest";
import { isTarget } from "../types/annotation";
import { router } from "./search";
import { context } from "../context";

const { db } = context();
beforeEach(() => db.seed.run());
afterAll(() => db.destroy());
const app = express().use(router(context));

test("search result fields", async () => {
  return request(app)
    .get("/")
    .expect(200)
    .then(({ body }) => body.rows[0])
    .then(data => {
      expect(data.group).toMatch(/^[a-z0-9\-]{36}$/);
      expect(isTarget(data.target[0])).toBeTruthy();
      expect(data.links.json).toMatch(/^http/);
      expect(data.links.incontext).toMatch(/^http/);
      expect(data.tags.length).toBeGreaterThan(-1);
    });
});
