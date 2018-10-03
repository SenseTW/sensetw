import * as express from "express";
import { router as Root } from "./root";
import { router as Links } from "./links";
import { router as Profile } from "./profile";
import { router as Search } from "./search";
import { router as Annotations } from "./annotations";
import { Context } from "../context";

export function router(context: Context) {
  const router = express.Router();
  router.get("/ping", (req, res, next) => res.send("pong"));
  router.use("/", Root(context));
  router.use("/links", Links(context));
  router.use("/profile", Profile(context));
  router.use("/search", Search(context));
  router.use("/annotations", Annotations(context));
  return router;
}
