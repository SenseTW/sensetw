import * as express from "express";
import * as request from "supertest";
import { router } from "./links";
import { context } from "../context";

const app = express().use(router(context));

test("links", async () => {
  return request(app)
    .get("/")
    .expect(200)
    .then(({ body }) => {
      expect("account.settings" in body).toBeTruthy();
      expect("forgot-password" in body).toBeTruthy();
      expect("groups.new" in body).toBeTruthy();
      expect("help" in body).toBeTruthy();
      expect("oauth.authorize" in body).toBeTruthy();
      expect("oauth.revoke" in body).toBeTruthy();
      expect("search.tag" in body).toBeTruthy();
      expect("signup" in body).toBeTruthy();
      expect("user" in body).toBeTruthy();
    });
});
